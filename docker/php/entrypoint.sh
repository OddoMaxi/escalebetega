#!/bin/sh
set -e

# The Vite build output and static product images are baked into this
# image, but escale_nginx (a separate container) needs them too. Re-sync
# into the shared volumes on every start so nginx always serves what THIS
# image was built with, instead of stale content from a previous deploy.
mkdir -p /var/www/html/public-shared/build /var/www/html/public-shared/images
cp -r /var/www/html/public/build/. /var/www/html/public-shared/build/
cp -r /var/www/html/public/images/. /var/www/html/public-shared/images/

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link 2>/dev/null || true

# Freshly mounted volumes (public-shared, storage) start out root-owned;
# php-fpm's workers run as "escale" (see docker/php/www.conf), so fix
# ownership here, as root, right before dropping into the actual process.
chown -R escale:escale /var/www/html/public-shared /var/www/html/storage /var/www/html/bootstrap/cache

exec "$@"
