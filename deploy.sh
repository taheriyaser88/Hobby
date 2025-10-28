#!/bin/bash

# Deploy script for Hobby project on VPS
# Usage: ./deploy.sh <branch-name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if branch argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Branch name is required${NC}"
    echo "Usage: ./deploy.sh <branch-name>"
    echo "Example: ./deploy.sh develop"
    exit 1
fi

BRANCH=$1
PROJECT_DIR="/root/hobby"
GIT_REPO="https://github.com/taheriyaser88/Hobby.git"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Hobby Project Deployment Script${NC}"
echo -e "${GREEN}  Branch: ${BRANCH}${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Clone or update repository
echo -e "${YELLOW}[1/6] Setting up project directory...${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "Project directory exists, updating..."
    cd $PROJECT_DIR
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
    git reset --hard origin/$BRANCH
else
    echo "Cloning repository..."
    if [ -d "$PROJECT_DIR" ]; then
        rm -rf $PROJECT_DIR
    fi
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    git clone $GIT_REPO .
    git checkout $BRANCH
fi

# Step 2: Stop existing containers
echo -e "${YELLOW}[2/6] Stopping existing containers...${NC}"
cd $PROJECT_DIR
if [ -f docker-compose.yml ]; then
    # Try docker compose (v2) first, then docker-compose (v1)
    if command -v docker &> /dev/null && docker compose version &> /dev/null; then
        docker compose down || true
    elif command -v docker-compose &> /dev/null; then
        docker-compose down || true
    fi
fi

# Step 3: Skip Nginx for now (only backend)
echo -e "${YELLOW}[3/6] Skipping Nginx (backend only)...${NC}"
# Nginx configuration skipped for now
cat > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Increase body size limit for file uploads
    client_max_body_size 100M;

    # Backend API
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # OAuth2 endpoints
    location /login/ {
        proxy_pass http://backend:8080/login/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://frontend:80/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Step 4: Create production docker-compose.yml with Nginx
echo -e "${YELLOW}[4/6] Creating production docker-compose.yml...${NC}"

# Make sure we're in the project directory
cd $PROJECT_DIR

# Create production docker-compose.yml
if [ -f docker-compose.yml ]; then
    cp docker-compose.yml docker-compose.yml.bak
    
    # Create new docker-compose.yml for production (Backend + MySQL only)
    cat > docker-compose.yml << 'EOF'
services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: hobby-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root@root
      MYSQL_DATABASE: hobby_db
      MYSQL_USER: hobby_user
      MYSQL_PASSWORD: hobby_password
    ports:
      - "127.0.0.1:3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./hobby-backend/src/main/resources/db/migration:/docker-entrypoint-initdb.d
    networks:
      - hobby-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot@root"]
      interval: 10s
      timeout: 5s
      start_period: 30s
      retries: 5

  # Backend Service
  backend:
    build: ./hobby-backend
    container_name: hobby-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/hobby_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: hobby_user
      SPRING_DATASOURCE_PASSWORD: hobby_password
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_MAIL_USERNAME: ${MAIL_USERNAME:-}
      SPRING_MAIL_PASSWORD: ${MAIL_PASSWORD:-}
      GOOGLE_CREDENTIALS_FILE_PATH: ${GOOGLE_CREDENTIALS_FILE_PATH:-}
    ports:
      - "80:8080"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - hobby-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mysql_data:

networks:
  hobby-network:
    driver: bridge
EOF
    echo "Production docker-compose.yml created successfully"
else
    echo "Error: docker-compose.yml not found!"
    exit 1
fi

# Step 5: Build and start containers
echo -e "${YELLOW}[5/6] Building and starting containers...${NC}"
cd $PROJECT_DIR

# Detect docker compose command
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo "Using Docker Compose V2"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo "Using Docker Compose V1"
else
    echo -e "${RED}Error: Neither 'docker compose' nor 'docker-compose' found!${NC}"
    exit 1
fi

$COMPOSE_CMD build --no-cache
$COMPOSE_CMD up -d

# Step 6: Wait for services to be ready
echo -e "${YELLOW}[6/6] Waiting for services to be ready...${NC}"
sleep 10

# Check service status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${GREEN}========================================${NC}"

echo ""
echo "Service Status:"
$COMPOSE_CMD ps

echo ""
echo -e "${GREEN}Access the application at:${NC}"
echo "  - Frontend: http://$(curl -s ifconfig.me)"
echo "  - Backend API: http://$(curl -s ifconfig.me)/api/"
echo "  - Health Check: http://$(curl -s ifconfig.me)/health"

echo ""
echo "To view logs:"
echo "  - All services: docker-compose logs -f"
echo "  - Backend: docker-compose logs -f backend"
echo "  - Frontend: docker-compose logs -f frontend"
echo "  - Nginx: docker-compose logs -f nginx"
echo ""
echo -e "${GREEN}Deployment script completed successfully!${NC}"

