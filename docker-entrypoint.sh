#!/bin/sh
set -e

PRISMA="node ./node_modules/prisma/build/index.js"

echo "Cleaning up duplicate tracking events..."
node ./prisma/cleanup-duplicates.mjs

echo "Pushing database schema..."
$PRISMA db push --skip-generate --accept-data-loss

echo "Running database seed..."
$PRISMA db seed || echo "Seed already applied or skipped."

echo "Starting application..."
node server.js
