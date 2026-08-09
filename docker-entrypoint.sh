#!/bin/sh
set -e

# On first boot the /app/data volume is empty — copy seed files in
for f in vehicles.json brands.json testimonials.json listings.json contacts.json media.json; do
  if [ ! -f "/app/data/$f" ]; then
    if [ -f "/app/data-seed/$f" ]; then
      cp "/app/data-seed/$f" "/app/data/$f"
      echo "[entrypoint] seeded $f"
    else
      echo "[]" > "/app/data/$f"
      echo "[entrypoint] created empty $f"
    fi
  fi
done

# Ensure uploads directory exists
mkdir -p /app/public/uploads

exec "$@"
