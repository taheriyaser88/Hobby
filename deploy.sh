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
    docker-compose down
fi

# Step 3: Create Nginx configuration
echo -e "${YELLOW}[3/6] Setting up Nginx configuration...${NC}"
cat > $PROJECT_DIR/nginx.conf << 'EOF'
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

# Step 4: Update docker-compose.yml to use Nginx
echo -e "${YELLOW}[4/6] Updating docker-compose.yml for production...${NC}"

# Make sure we're in the project directory
cd $PROJECT_DIR

# Backup original docker-compose.yml if exists
if [ -f docker-compose.yml ]; then
    cp docker-compose.yml docker-compose.yml.bak
    
    # Update existing docker-compose.yml to add Nginx and modify ports
    sed -i 's/- "8080:8080"/- "127.0.0.1:8080:8080"/' docker-compose.yml 2>/dev/null || true
    sed -i 's/- "80:80"/- "127.0.0.1:81:80"/' docker-compose.yml 2>/dev/null || true

    # Add Nginx service to docker-compose.yml if not exists
    if ! grep -q "hobby-nginx" docker-compose.yml; then
        # Remove the last two lines (volumes and networks closing)
        sed -i '$ d' docker-compose.yml
        sed -i '$ d' docker-compose.yml
        
        cat >> docker-compose.yml << 'EOF'

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: hobby-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - nginx_logs:/var/log/nginx
    depends_on:
      - backend
      - frontend
    networks:
      - hobby-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
EOF
        # Check if mysql_data already exists and add nginx_logs
        if grep -q "mysql_data:" docker-compose.yml; then
            sed -i '/mysql_data:/a \  nginx_logs:' docker-compose.yml
        else
            echo "  mysql_data:" >> docker-compose.yml
            echo "  nginx_logs:" >> docker-compose.yml
        fi
        
        cat >> docker-compose.yml << 'EOF'

networks:
  hobby-network:
    driver: bridge
EOF
    fi
else
    echo "Error: docker-compose.yml not found!"
    exit 1
fi

# Step 5: Build and start containers
echo -e "${YELLOW}[5/6] Building and starting containers...${NC}"
cd $PROJECT_DIR
docker-compose build --no-cache
docker-compose up -d

# Step 6: Wait for services to be ready
echo -e "${YELLOW}[6/6] Waiting for services to be ready...${NC}"
sleep 10

# Check service status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${GREEN}========================================${NC}"

echo ""
echo "Service Status:"
docker-compose ps

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

