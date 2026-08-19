#!/bin/bash
set -e

echo "🚀 Welcome to the Notify Production Setup!"
echo "This script will configure your environment variables and start the services."
echo "--------------------------------------------------------"

read -p "Enter your Stripe Secret Key (sk_live_...): " STRIPE_SECRET_KEY
read -p "Enter your Clerk Publishable Key (pk_live_...): " CLERK_PUBLISHABLE_KEY
read -p "Enter your Clerk Secret Key (sk_live_...): " CLERK_SECRET_KEY
read -p "Enter your primary domain (e.g., notifyhq.in): " PRIMARY_DOMAIN

# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
STORE_ENCRYPTION_KEY=$(openssl rand -hex 16)

# Write to .env
cat > .env <<EOF
# Core API Settings
PORT=3000
FRONT_BASE_URL=https://app.$PRIMARY_DOMAIN
API_ROOT_URL=https://api.$PRIMARY_DOMAIN
WIDGET_BASE_URL=https://widget.$PRIMARY_DOMAIN
WEBHOOK_URL=https://ws.$PRIMARY_DOMAIN

# MongoDB & Redis (Using local docker containers)
MONGO_URL=mongodb://mongo:27017/novu-db
REDIS_HOST=redis
REDIS_PORT=6379

# Notify Custom Commercialization & Branding
VITE_NOVU_ENTERPRISE=true
VITE_EE_AUTH_PROVIDER=clerk

# Secrets
JWT_SECRET=$JWT_SECRET
STORE_ENCRYPTION_KEY=$STORE_ENCRYPTION_KEY

# Clerk Integration
VITE_CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Stripe Integration
STRIPE_API_KEY=$STRIPE_SECRET_KEY
EOF

echo "✅ Environment variables written to .env!"
echo "Starting Docker Compose services..."

docker compose -f docker/production/docker-compose.yml up -d

echo "✅ Services are starting up!"
echo "You can access your Notify dashboard at https://app.$PRIMARY_DOMAIN once DNS is configured."
