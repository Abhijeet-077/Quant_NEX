#!/bin/bash

# Start PostgreSQL in Docker
docker run --name documentmasterai-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=documentmasterai -p 5432:5432 -d postgres:14

echo "PostgreSQL started on port 5432"
echo "Database: documentmasterai"
echo "Username: postgres"
echo "Password: postgres"
