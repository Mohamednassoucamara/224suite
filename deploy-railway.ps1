# Script de déploiement Railway pour 224Suite
Write-Host "🚀 Déploiement 224Suite sur Railway..." -ForegroundColor Green

# Vérifier si Railway CLI est installé
try {
    railway --version
    Write-Host "✅ Railway CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI non trouvé. Installation..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Se connecter à Railway
Write-Host "🔐 Connexion à Railway..." -ForegroundColor Yellow
railway login

# Initialiser le projet Railway (si pas déjà fait)
if (!(Test-Path ".railway")) {
    Write-Host "📁 Initialisation du projet Railway..." -ForegroundColor Yellow
    railway init
}

# Déployer le projet
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
railway up

# Afficher l'URL du déploiement
Write-Host "🌐 Récupération de l'URL..." -ForegroundColor Yellow
railway domain

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "📋 Variables d'environnement à configurer dans Railway Dashboard:" -ForegroundColor Cyan
Write-Host "   - MONGODB_URI" -ForegroundColor White
Write-Host "   - JWT_SECRET" -ForegroundColor White
Write-Host "   - JWT_EXPIRE" -ForegroundColor White
Write-Host "   - FRONTEND_URL" -ForegroundColor White
Write-Host "   - EMAIL_HOST" -ForegroundColor White
Write-Host "   - EMAIL_PORT" -ForegroundColor White
Write-Host "   - EMAIL_USER" -ForegroundColor White
Write-Host "   - EMAIL_PASS" -ForegroundColor White
