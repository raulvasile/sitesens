#!/usr/bin/env bash
# backup.sh — dump Postgres + tar Strapi uploads, gzipped, with retention.
#
# Usage (from the directory containing docker-compose.yml):
#   ./backup.sh [output-dir]
#
# Cron example (daily at 03:17):
#   17 3 * * *  cd /opt/sens/site && ./backup.sh >> /var/log/sens-backup.log 2>&1

set -euo pipefail

OUT_DIR="${1:-/var/backups/sens}"
TS="$(date +%Y%m%d_%H%M%S)"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

mkdir -p "$OUT_DIR"

# Resolve the volume name. docker compose prefixes volumes with the
# project name (= directory name unless COMPOSE_PROJECT_NAME is set).
PROJECT="${COMPOSE_PROJECT_NAME:-$(basename "$PWD")}"
UPLOADS_VOLUME="${PROJECT}_strapi_uploads"

echo "[$(date -Iseconds)] backup → $OUT_DIR"

# 1. Postgres dump (custom format → faster restore, parallel-able).
echo "  · pg_dump"
docker compose exec -T db pg_dump -U strapi -F c strapi \
  | gzip -9 > "$OUT_DIR/db_${TS}.dump.gz"

# 2. Uploads tarball (read directly from the volume; doesn't need Strapi up).
echo "  · uploads tar (volume: $UPLOADS_VOLUME)"
docker run --rm \
  -v "${UPLOADS_VOLUME}:/data:ro" \
  -v "${OUT_DIR}:/backup" \
  alpine:3 \
  tar czf "/backup/uploads_${TS}.tar.gz" -C /data .

# 3. Retention — drop anything older than RETENTION_DAYS days.
echo "  · prune > ${RETENTION_DAYS}d"
find "$OUT_DIR" -maxdepth 1 -type f \
  \( -name 'db_*.dump.gz' -o -name 'uploads_*.tar.gz' \) \
  -mtime +"$RETENTION_DAYS" -delete

echo "[$(date -Iseconds)] done"
