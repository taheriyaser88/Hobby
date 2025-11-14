#!/bin/bash

# Build و Deploy به VPS
set -e

VPS_IP="82.115.18.109"
VPS_USER="root"
VPS_PATH="/var/www/html"

echo "🚀 Building production bundle..."
cd hobby-frontend

# استفاده از nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
    nvm use 20 >/dev/null 2>&1 || nvm use 18 >/dev/null 2>&1
fi

npm run build -- --configuration production

if [ ! -d "dist/hobby-frontend/browser" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📤 Uploading to $VPS_USER@$VPS_IP:$VPS_PATH/browser/..."
ssh "$VPS_USER@$VPS_IP" "mkdir -p $VPS_PATH/browser"
scp -r dist/hobby-frontend/browser/* "$VPS_USER@$VPS_IP:$VPS_PATH/browser/"

echo "✅ Deployed successfully!"
echo "🌐 Check: http://$VPS_IP"
