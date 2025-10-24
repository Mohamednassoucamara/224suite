# Script de déploiement Railway pour 224Suite (PowerShell)
# Usage: .\scripts\deploy-railway.ps1

Write-Host "🚀 Déploiement 224Suite sur Railway..." -ForegroundColor Green

# Vérifier que Railway CLI est installé
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI n'est pas installé. Installation..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Se connecter à Railway
Write-Host "🔐 Connexion à Railway..." -ForegroundColor Yellow
railway login

# Initialiser le projet Railway
Write-Host "⚙️ Initialisation du projet Railway..." -ForegroundColor Yellow
railway init

# Configurer les variables d'environnement
Write-Host "🔧 Configuration des variables d'environnement..." -ForegroundColor Yellow

# Variables de base de données Railway
railway variables set NODE_ENV=production
railway variables set DB_HOST=gondola.proxy.rlwy.net
railway variables set DB_PORT=11311
railway variables set DB_USER=root
railway variables set DB_PASSWORD=BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
railway variables set DB_NAME=224suite

# Variables de l'application
railway variables set REACT_APP_API_URL=https://224suite.railway.app

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# Construire l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
npm run build

# Déployer
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
railway up

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible sur Railway" -ForegroundColor Cyan
