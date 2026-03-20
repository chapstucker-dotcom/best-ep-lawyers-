#!/usr/bin/env bash
# deploy.sh – Manual deployment helper for Best EP Lawyers
# Builds the project and optionally deploys to Vercel.
# Usage:
#   bash deploy.sh           # build only
#   bash deploy.sh --prod    # build + deploy to production via Vercel CLI

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

step() { echo -e "\n${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

DEPLOY_PROD=false
for arg in "$@"; do
  [[ "$arg" == "--prod" ]] && DEPLOY_PROD=true
done

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║   Best EP Lawyers – Deploy Script        ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ── 1. Check .env ────────────────────────────────────────────
step "Checking environment..."
if [ ! -f ".env" ]; then
  warn ".env not found. Copy .env.example and fill in values before deploying."
fi

# ── 2. Install dependencies ───────────────────────────────────
step "Installing dependencies..."
npm ci
ok "Dependencies installed"

# ── 3. Lint ───────────────────────────────────────────────────
step "Running linter..."
npm run lint
ok "Lint passed"

# ── 4. Type check ────────────────────────────────────────────
step "Type checking..."
npx tsc --noEmit
ok "Type check passed"

# ── 5. Build ─────────────────────────────────────────────────
step "Building for production..."
npm run build
ok "Build complete – output in dist/"

# ── 6. Deploy to Vercel (optional) ───────────────────────────
if [ "$DEPLOY_PROD" = true ]; then
  step "Deploying to Vercel (production)..."
  if ! command -v vercel &>/dev/null; then
    fail "Vercel CLI not found. Install with: npm install -g vercel"
  fi
  vercel --prod
  ok "Deployed to production"
else
  echo ""
  echo -e "${GREEN}Build successful!${NC}"
  echo ""
  echo "To deploy manually:"
  echo "  bash deploy.sh --prod   # deploy to production via Vercel CLI"
  echo ""
  echo "Or push to main – GitHub Actions will deploy automatically."
fi
