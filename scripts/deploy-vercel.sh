#!/bin/bash

# Script de déploiement Vercel pour 224Suite
# Usage: ./scripts/deploy-vercel.sh

echo "🚀 Déploiement 224Suite sur Vercel..."

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Se connecter à Vercel
echo "🔐 Connexion à Vercel..."
vercel login

# Configurer les variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."

# Variables de base de données Railway
vercel env add NODE_ENV production
vercel env add DB_HOST gondola.proxy.rlwy.net
vercel env add DB_PORT 11311
vercel env add DB_USER root
vercel env add DB_PASSWORD BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
vercel env add DB_NAME 224suite

# Variables de l'application
vercel env add REACT_APP_API_URL https://224suite.vercel.app

echo "✅ Variables d'environnement configurées"

# Construire l'application
echo "🔨 Construction de l'application..."
npm run build

# Déployer
echo "🚀 Déploiement en cours..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est disponible sur Vercel"
