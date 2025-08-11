#!/bin/sh
envsubst '$DOMAIN $FRONTEND_DOMAIN $FRONTEND_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec "$@"