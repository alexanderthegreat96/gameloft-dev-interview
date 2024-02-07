FROM dunglas/frankenphp:sha-effb580-builder-php8.2.15-alpine

WORKDIR /var/www/html

COPY backend/composer.json backend/composer.lock /var/www/html/

RUN apk add curl && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apk add \
    openssl-dev \
    autoconf \
    g++ \
    make \
    bash \
    libzip-dev \
    mysql-client \
    mysql-dev \
    && docker-php-ext-install pcntl pdo_mysql zip

RUN composer install --no-interaction --no-plugins --no-scripts

COPY backend/ /var/www/html

ENV PHP_OPCACHE_ENABLE=1 \
    PHP_OPCACHE_ENABLE_CLI=1 \
    PHP_OPCACHE_MEMORY_CONSUMPTION=128 \
    PHP_OPCACHE_MAX_ACCELERATED_FILES=10000 \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=0

RUN php artisan storage:link

COPY backend/post-install.sh /var/www/html
RUN chmod +x /var/www/html/post-install.sh
RUN /var/www/html/post-install.sh

EXPOSE 8000

CMD ["sh", "-c", "php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8000"]
