# Script de déploiement Netlify pour 224Suite (PowerShell)
# Usage: .\scripts\deploy-netlify.ps1

Write-Host "🚀 Déploiement 224Suite sur Netlify..." -ForegroundColor Green

# Vérifier que Netlify CLI est installé
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI n'est pas installé. Installation..." -ForegroundColor Red
    npm install -g netlify-cli
}

# Se connecter à Netlify
Write-Host "🔐 Connexion à Netlify..." -ForegroundColor Yellow
netlify login

# Initialiser le projet Netlify
Write-Host "⚙️ Initialisation du projet Netlify..." -ForegroundColor Yellow
netlify init

# Configurer les variables d'environnement
Write-Host "🔧 Configuration des variables d'environnement..." -ForegroundColor Yellow

# Variables de base de données Railway
netlify env:set NODE_ENV production
netlify env:set DB_HOST gondola.proxy.rlwy.net
netlify env:set DB_PORT 11311
netlify env:set DB_USER root
netlify env:set DB_PASSWORD BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
netlify env:set DB_NAME 224suite

# Variables de l'application
netlify env:set REACT_APP_API_URL https://224suite.netlify.app

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# Construire l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
npm run build

# Déployer
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
netlify deploy --prod --dir=build

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible sur Netlify" -ForegroundColor Cyan
