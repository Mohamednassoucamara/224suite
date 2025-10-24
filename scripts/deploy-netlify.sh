#!/bin/bash

# Script de déploiement Netlify pour 224Suite
# Usage: ./scripts/deploy-netlify.sh

echo "🚀 Déploiement 224Suite sur Netlify..."

# Vérifier que Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé. Installation..."
    npm install -g netlify-cli
fi

# Se connecter à Netlify
echo "🔐 Connexion à Netlify..."
netlify login

# Initialiser le projet Netlify
echo "⚙️ Initialisation du projet Netlify..."
netlify init

# Configurer les variables d'environnement
echo "🔧 Configuration des variables d'environnement..."

# Variables de base de données Railway
netlify env:set NODE_ENV production
netlify env:set DB_HOST gondola.proxy.rlwy.net
netlify env:set DB_PORT 11311
netlify env:set DB_USER root
netlify env:set DB_PASSWORD BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
netlify env:set DB_NAME 224suite

# Variables de l'application
netlify env:set REACT_APP_API_URL https://224suite.netlify.app

echo "✅ Variables d'environnement configurées"

# Construire l'application
echo "🔨 Construction de l'application..."
npm run build

# Déployer
echo "🚀 Déploiement en cours..."
netlify deploy --prod --dir=build

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est disponible sur Netlify"
