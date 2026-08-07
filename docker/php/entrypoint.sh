#!/bin/sh
set -e

# The Vite build output is baked into this image, but escale_nginx (a
# separate container) needs it too. Re-sync it into the shared volume on
# every start so nginx always serves what THIS image was built with,
# instead of stale content from a previous deploy.
mkdir -p /var/www/html/public-shared/build
cp -r /var/www/html/public/build/. /var/www/html/public-shared/build/

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link 2>/dev/null || true

exec "$@"
