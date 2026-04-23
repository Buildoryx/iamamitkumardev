#!/usr/bin/env bash
# push-env.sh — Safely push production env vars to EC2
# Run this ONCE after SSH is unblocked to update server .env
# Usage: ./push-env.sh
#
# This NEVER syncs via rsync (which would expose secrets in process list).
# Instead it uses ssh stdin to write the file directly.

set -euo pipefail
umask 077

: "${EC2_HOST:?Set EC2_HOST for legacy AWS server}"
: "${EC2_USER:=ubuntu}"
: "${APP_DIR:=/var/www/devamitkumar}"
: "${EC2_PEM_KEY:?Set EC2_PEM_KEY to your SSH private key path}"

PEM_KEY="${EC2_PEM_KEY}"

echo "▶ Pushing production .env to EC2..."

# Stream the local .env over SSH — never touches disk on the way
ssh -i "${PEM_KEY}" -o StrictHostKeyChecking=accept-new "${EC2_USER}@${EC2_HOST}" \
  "cat > ${APP_DIR}/.env && chmod 600 ${APP_DIR}/.env && echo '✅ .env written with 600 perms'" \
  < .env

echo ""
echo "▶ Restarting PM2 to pick up new env vars..."
ssh -i "${PEM_KEY}" -o StrictHostKeyChecking=accept-new "${EC2_USER}@${EC2_HOST}" \
  "cd ${APP_DIR} && pm2 restart iamamitkumar && pm2 status"

echo ""
echo "✅ Env updated and app restarted!"
