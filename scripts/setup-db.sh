#!/bin/bash

# Create the database
echo "Creating PostgreSQL database..."
createdb -U postgres documentmasterai || echo "Database already exists or could not be created"

# Run the database migrations
echo "Running database migrations..."
npm run db:push

# Initialize the database with demo data
echo "Initializing database with demo data..."
npx tsx scripts/init-db.ts

echo "Database setup complete!"
