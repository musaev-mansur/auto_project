#!/bin/bash

echo "🚀 Initializing database for Render deployment..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed database (optional)
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️ Seeding failed or no seed script available"

echo "✅ Database initialization complete!"
