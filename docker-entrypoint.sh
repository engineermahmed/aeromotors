#!/bin/sh
set -e

# On first boot the /app/data volume is empty — copy seed files in
for f in vehicles.json brands.json testimonials.json listings.json contacts.json media.json users.json roles.json newsletter.json; do
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

# Bootstrap auth.json from env var on first boot
if [ ! -f "/app/data/auth.json" ]; then
  PASS="${ADMIN_DEFAULT_PASSWORD}"
  printf '{"adminPassword":"%s"}\n' "$PASS" > /app/data/auth.json
  echo "[entrypoint] created auth.json"
fi

# Seed finance.json with defaults on first boot
if [ ! -f "/app/data/finance.json" ]; then
  printf '{"defaultRate":5.99,"defaultTerm":84,"defaultDeposit":5000,"defaultVehiclePrice":40000,"availableTerms":[24,36,48,60,72,84],"minRate":1.99,"maxRate":29.99}\n' > /app/data/finance.json
  echo "[entrypoint] created finance.json"
fi

# Ensure uploads directory exists
mkdir -p /app/public/uploads

exec "$@"
