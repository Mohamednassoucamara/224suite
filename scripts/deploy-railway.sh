#!/bin/bash

# Script de déploiement Railway pour 224Suite
# Usage: ./scripts/deploy-railway.sh

echo "🚀 Déploiement 224Suite sur Railway..."

# Vérifier que Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé. Installation..."
    npm install -g @railway/cli
fi

# Se connecter à Railway
echo "🔐 Connexion à Railway..."
railway login

# Initialiser le projet Railway
echo "⚙️ Initialisation du projet Railway..."
railway init

# Configurer les variables d'environnement
echo "🔧 Configuration des variables d'environnement..."

# Variables de base de données Railway
railway variables set NODE_ENV=production
railway variables set DB_HOST=gondola.proxy.rlwy.net
railway variables set DB_PORT=11311
railway variables set DB_USER=root
railway variables set DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
railway variables set DB_NAME=224suite

# Variables de l'application
railway variables set REACT_APP_API_URL=https://224suite.railway.app

echo "✅ Variables d'environnement configurées"

# Construire l'application
echo "🔨 Construction de l'application..."
npm run build

# Déployer
echo "🚀 Déploiement en cours..."
railway up

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est disponible sur Railway"
