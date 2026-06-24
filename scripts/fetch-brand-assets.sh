#!/usr/bin/env bash
#
# fetch-brand-assets.sh
# ---------------------
# Idempotent downloader for official KDDI / Telehouse brand assets into public/brand/.
#
# IMPORTANT: This script is intentionally NON-FATAL on download failure (no `set -e`).
# In sandboxed/CI environments the kddi.com brand domains are frequently unreachable
# (firewall allowlist). When a download fails, the committed *recreated* fallback SVGs
# in public/brand/ remain in place and the app still renders brand-correct.
#
# Run from the repo root:  bash scripts/fetch-brand-assets.sh
#
# After inspecting kddi.com (view-source / network tab), replace the candidate URLs
# below with the exact discovered asset paths to pull the official files.

set -uo pipefail

BRAND_DIR="public/brand"
mkdir -p "$BRAND_DIR"

CURL="curl -fsSL --connect-timeout 12 --max-time 40"
fetched=()
failed=()

# try_fetch <output-file> <url> [url2 url3 ...]
# Attempts each candidate URL in order; stops at the first success.
try_fetch() {
  local out="$1"; shift
  local url
  for url in "$@"; do
    echo "  → trying: $url"
    if $CURL -o "$BRAND_DIR/$out.tmp" "$url"; then
      mv "$BRAND_DIR/$out.tmp" "$BRAND_DIR/$out"
      echo "  ✓ saved $BRAND_DIR/$out (from $url)"
      fetched+=("$out <= $url")
      return 0
    fi
  done
  rm -f "$BRAND_DIR/$out.tmp"
  echo "  ✗ all sources failed for $out (keeping recreated fallback if present)"
  failed+=("$out")
  return 1
}

echo "Fetching KDDI brand assets into $BRAND_DIR ..."

# --- KDDI favicon -----------------------------------------------------------
try_fetch "favicon.ico" \
  "https://www.kddi.com/favicon.ico" \
  "https://www.kddi.com/extlib/files/favicon.ico"

# --- KDDI primary logo (color) ----------------------------------------------
try_fetch "kddi-logo.svg" \
  "https://www.kddi.com/extlib/files/common/images/logo.svg" \
  "https://www.kddi.com/common/images/logo.svg"

# --- KDDI white / reversed logo ---------------------------------------------
try_fetch "kddi-logo-white.svg" \
  "https://www.kddi.com/extlib/files/common/images/logo_white.svg" \
  "https://www.kddi.com/common/images/logo_white.svg"

# --- Telehouse logo (Overseas region card) ----------------------------------
try_fetch "telehouse-logo.svg" \
  "https://www.telehouse.net/wp-content/themes/telehouse/assets/images/logo.svg"

echo
echo "Summary:"
echo "  fetched: ${#fetched[@]}"
echo "  failed : ${#failed[@]}"
echo
echo "NOTE: brand-assets.json is maintained by hand to record the source + status"
echo "      of each committed file (official download vs. recreated fallback)."
