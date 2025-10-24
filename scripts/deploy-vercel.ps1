# Script de déploiement Vercel pour 224Suite (PowerShell)
# Usage: .\scripts\deploy-vercel.ps1

Write-Host "🚀 Déploiement 224Suite sur Vercel..." -ForegroundColor Green

# Vérifier que Vercel CLI est installé
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI n'est pas installé. Installation..." -ForegroundColor Red
    npm install -g vercel
}

# Se connecter à Vercel
Write-Host "🔐 Connexion à Vercel..." -ForegroundColor Yellow
vercel login

# Configurer les variables d'environnement
Write-Host "⚙️ Configuration des variables d'environnement..." -ForegroundColor Yellow

# Variables de base de données Railway
vercel env add NODE_ENV production
vercel env add DB_HOST gondola.proxy.rlwy.net
vercel env add DB_PORT 11311
vercel env add DB_USER root
vercel env add DB_PASSWORD BPlZtcXgcrhlcSVGInePcSDffgMHZzmw
vercel env add DB_NAME 224suite

# Variables de l'application
vercel env add REACT_APP_API_URL https://224suite.vercel.app

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# Construire l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
npm run build

# Déployer
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible sur Vercel" -ForegroundColor Cyan
