# Script de déploiement Railway pour PostgreSQL
# Exécutez ce script depuis le dossier backend

Write-Host "🚀 Déploiement du backend PostgreSQL sur Railway..." -ForegroundColor Green

# Vérifier que Railway CLI est installé
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI détecté: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI non installé. Installation..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Vérifier la connexion Railway
Write-Host "🔐 Vérification de la connexion Railway..." -ForegroundColor Yellow
railway login

# Aller dans le dossier backend
Set-Location backend

# Initialiser le projet Railway s'il n'existe pas
if (-not (Test-Path ".railway")) {
    Write-Host "📁 Initialisation du projet Railway..." -ForegroundColor Yellow
    railway init
}

# Déployer le projet
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
railway up

# Afficher les informations de déploiement
Write-Host "📊 Informations de déploiement:" -ForegroundColor Green
railway status

# Afficher l'URL de l'API
Write-Host "🌐 URL de l'API:" -ForegroundColor Green
railway domain

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "📝 N'oubliez pas de configurer les variables d'environnement dans Railway:" -ForegroundColor Yellow
Write-Host "   - DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT" -ForegroundColor Cyan
Write-Host "   - JWT_SECRET" -ForegroundColor Cyan
Write-Host "   - FRONTEND_URL" -ForegroundColor Cyan
