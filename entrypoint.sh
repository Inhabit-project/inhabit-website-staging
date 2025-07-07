#!/bin/sh

export PORT=${PORT}
export HOST=${HOST}

envsubst '$PORT $HOST' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "\n🟢 NGINX CONFIG:"
cat /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
