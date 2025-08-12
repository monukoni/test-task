#!/bin/bash

BRANCH=${1:-main}
DOMAIN=${2:-localhost}
EMAIL=${3:-admin@example.com}

echo "Deploying branch: $BRANCH"
echo "Domain: $DOMAIN"

git fetch origin &> /dev/null
git checkout $BRANCH &> /dev/null
git pull origin $BRANCH &> /dev/null

export DOMAIN=$DOMAIN
export EMAIL=$EMAIL

echo "Deploying init infrastructure to get ssl certificate"
docker compose -f docker-compose.2in1.yml -f docker-compose.2in1.init.yml up -d &> /dev/null

echo "Generating SSL"
docker run --rm \
  -v "$(pwd)/nginx/certs:/etc/letsencrypt" \
  -v "$(pwd)/nginx/html:/var/www/html" \
  certbot/certbot certonly --webroot -w /var/www/html \
  -d prod-new.monukoni.site -d dev-new.monukoni.site \
  --email $EMAIL --agree-tos --no-eff-email \
  --keep-until-expiring --non-interactive &> /dev/null

echo "Deploying final infrastructure"
docker compose -f docker-compose.2in1.yml down &> /dev/null
docker compose -f docker-compose.2in1.yml up -d --build &> /dev/null

echo waiting 20 secs
sleep 20;

echo "Check site availability"
if curl -L -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo "Web available HTTPS"
else
    echo "Web is NOT available by https"
    exit 1
fi

echo "Check certificate"
CERT_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
DAYS_LEFT=$(( ( $(date -d "$CERT_EXPIRY" +%s) - $(date +%s) ) / 86400 ))

echo "The certificate is valid until: $CERT_EXPIRY"
echo "Days left: $DAYS_LEFT"

echo "Deploy succeed"
echo "Web available by: https://$DOMAIN"