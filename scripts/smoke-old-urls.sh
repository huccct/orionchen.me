#!/usr/bin/env bash
set -e

HOST="${1:-https://orionchen-me-abc.vercel.app}"

for slug in $(ls ~/Frontend/blog/data/blog/ | sed 's/\.mdx$//'); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$HOST/blog/$slug")
  echo "$code $HOST/blog/$slug"
done

curl -s -o /dev/null -w "%{http_code} /projects\n" "$HOST/projects"
curl -s -o /dev/null -w "%{http_code} /resume\n" "$HOST/resume"
