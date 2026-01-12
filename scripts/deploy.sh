#!/bin/bash
set -e

# Configuration
APP_DIR="${DEPLOY_PATH:-$HOME/htdocs/www.presisikonsulindoprima.com}"
BRANCH="${DEPLOY_BRANCH:-master}"

echo "🚀 Starting deployment..."

# Navigate to project directory
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  echo "📂 Changed directory to $APP_DIR"
else
  echo "❌ Directory $APP_DIR does not exist"
  exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes from $BRANCH..."
git fetch origin
git reset --hard origin/$BRANCH

# Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
  bun install --frozen-lockfile
else
  echo "⚠️ Bun not found, falling back to npm..."
  npm ci
fi

# Build application
echo "🏗️ Building application..."
if command -v bun &> /dev/null; then
  bun run build
else
  npm run build
fi

# Restart with PM2
echo "🔄 Restarting application..."
if pm2 show pkp-company-profile > /dev/null; then
    pm2 restart ecosystem.config.js
else
    pm2 start ecosystem.config.js
fi
pm2 save

echo "✅ Deployment completed successfully!"
