#!/usr/bin/env sh
# -----------------------------------------------------------------------------
# Entrypoint frontend Next.js (mode standalone)
#   - Petit point d'extension si tu as besoin d'injecter des variables
#     d'environnement runtime, attendre que l'API backend soit prête, etc.
# -----------------------------------------------------------------------------
set -e

echo "[entrypoint] Démarrage du frontend Next.js (standalone)..."
echo "[entrypoint] NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-non défini}"

exec "$@"
