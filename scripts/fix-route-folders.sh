#!/usr/bin/env bash
# Next.js dynamic routes need SQUARE BRACKETS in folder names.
# Zip and file-transfer tools strip them, so this project ships them as -name-.
# Run this ONCE after unzipping, before npm run dev.
#
#   bash scripts/fix-route-folders.sh
#
set -e
cd "$(dirname "$0")/../src/app"

mv_if() { if [ -d "$1" ]; then mv "$1" "$2"; echo "  $1  ->  $2"; fi; }

echo "Renaming dynamic route folders..."
mv_if '-state-/-city-/-section-/-slug-' '-state-/-city-/-section-/[slug]'
mv_if '-state-/-city-/-section-'        '-state-/-city-/[section]'
mv_if '-state-/-city-'                  '-state-/[city]'
mv_if '-state-'                         '[state]'

echo ""
echo "Done. You should now have:"
echo "  src/app/[state]/[city]/[section]/[slug]/page.tsx"
echo ""
echo "Next:  npm install && npm run db:setup"
