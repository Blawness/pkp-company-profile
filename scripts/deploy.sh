#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
  bun ci
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
