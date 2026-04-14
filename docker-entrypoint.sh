#!/bin/sh
set -e

PRISMA="node ./node_modules/prisma/build/index.js"

echo "Pushing database schema..."
$PRISMA db push --skip-generate

echo "Running database seed..."
$PRISMA db seed || echo "Seed already applied or skipped."

echo "Starting application..."
node server.js
