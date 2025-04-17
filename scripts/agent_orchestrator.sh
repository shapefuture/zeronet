#!/usr/bin/env bash
set -e

echo "[agent] Build, Test, Deploy orchestrator started."

# Build all packages/apps
pnpm build

# Run all tests
pnpm test

# Generate snapshot, deploy, etc. (expandable)
echo "[agent] Snapshot & deployment steps would be handled here."