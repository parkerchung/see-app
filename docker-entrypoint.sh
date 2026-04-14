#!/bin/sh
set -e

echo "Pushing database schema..."
npx prisma db push --skip-generate

echo "Running database seed..."
npx prisma db seed || echo "Seed already applied or skipped."

echo "Starting application..."
node server.js
