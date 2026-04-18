#!/bin/sh
set -e

echo "🚀 Starting application entrypoint..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -h ${POSTGRES_HOST:-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; do
  echo "   Database is unavailable - sleeping"
  sleep 2
done
echo "✅ Database is ready!"

# Run database migrations
echo "📦 Running database migrations..."
npm run migrate || {
  echo "❌ Migration failed"
  exit 1
}
echo "✅ Migrations completed"

# Run initial sync if needed
echo "🔄 Checking for initial sync..."
npm run sync:initial || {
  echo "❌ Initial sync failed"
  exit 1
}

# Start the application
echo "🎯 Starting application..."
exec "$@"
