#!/bin/sh
# set -e
set -eo pipefail

echo "Initializing database..."
npx prisma migrate deploy
echo "Starting the server..."
exec node ./dist/index.js
