#!/usr/bin/env bash
# setup.sh – Initialize a local development environment for Best EP Lawyers
# Usage: bash setup.sh

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

step() { echo -e "\n${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║   Best EP Lawyers – Local Setup Script   ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ── 1. Node.js version check ─────────────────────────────────
step "Checking Node.js version..."
NODE_VER=$(node --version 2>/dev/null || echo "not found")
if [[ "$NODE_VER" == "not found" ]]; then
  fail "Node.js is not installed. Install v18+ from https://nodejs.org"
fi
MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
if (( MAJOR < 18 )); then
  fail "Node.js v18+ is required (found $NODE_VER). Upgrade at https://nodejs.org"
fi
ok "Node.js $NODE_VER"

# ── 2. Install dependencies ───────────────────────────────────
step "Installing npm dependencies..."
npm install
ok "Dependencies installed"

# ── 3. Environment file ───────────────────────────────────────
step "Setting up .env file..."
if [ -f ".env" ]; then
  warn ".env already exists – skipping copy"
else
  cp .env.example .env
  ok "Created .env from .env.example"
  echo ""
  warn "ACTION REQUIRED: Open .env and fill in your Supabase and Stripe keys."
  warn "See SETUP.md for details on where to find each value."
fi

# ── 4. Supabase CLI check ─────────────────────────────────────
step "Checking for Supabase CLI..."
if command -v supabase &>/dev/null; then
  ok "Supabase CLI found: $(supabase --version)"
else
  warn "Supabase CLI not found. Install with: npm install -g supabase"
  warn "The CLI is optional for frontend dev but required to run migrations or Edge Functions."
fi

# ── 5. Done ───────────────────────────────────────────────────
echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Fill in your keys in .env  (if you haven't already)"
echo "  2. Run database migrations    (see SETUP.md or DEPLOYMENT.md)"
echo "  3. Start the dev server:      npm run dev"
echo "  4. Open:                      http://localhost:8080"
echo ""
