# Script de déploiement Railway pour 224Suite
# Auteur: Mohamed Nassou Camara
# Date: 2024

Write-Host "🚀 Déploiement 224Suite sur Railway..." -ForegroundColor Green

# Vérifier si Railway CLI est installé
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI détecté: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI non trouvé. Installation..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Vérifier si l'utilisateur est connecté
Write-Host "🔐 Vérification de la connexion Railway..." -ForegroundColor Yellow
$loginStatus = railway whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Connexion requise. Lancement de la connexion..." -ForegroundColor Yellow
    railway login
} else {
    Write-Host "✅ Utilisateur connecté: $loginStatus" -ForegroundColor Green
}

# Nettoyer les builds précédents
Write-Host "🧹 Nettoyage des builds précédents..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "✅ Builds nettoyés" -ForegroundColor Green
}

# Installer les dépendances du frontend
Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances frontend installées" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances frontend" -ForegroundColor Red
    exit 1
}

# Installer les dépendances du backend
Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances backend installées" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances backend" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Build du frontend
Write-Host "🔨 Build du frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend buildé avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du build du frontend" -ForegroundColor Red
    exit 1
}

# Déploiement sur Railway
Write-Host "🚀 Déploiement sur Railway..." -ForegroundColor Yellow

# Déployer le backend
Write-Host "🔧 Déploiement du backend..." -ForegroundColor Cyan
Set-Location backend
Write-Host "📝 Utilisation de la configuration: railway-backend.json" -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend déployé avec succès" -ForegroundColor Green
    
    # Récupérer l'URL du backend
    Write-Host "🌐 Récupération de l'URL du backend..." -ForegroundColor Yellow
    $backendUrl = railway domain
    Write-Host "🔗 Backend URL: $backendUrl" -ForegroundColor Green
    
    # Mettre à jour FRONTEND_URL dans les variables d'environnement
    Write-Host "⚙️  Configuration des variables d'environnement..." -ForegroundColor Yellow
    railway variables set FRONTEND_URL="https://$backendUrl"
    
} else {
    Write-Host "❌ Erreur lors du déploiement du backend" -ForegroundColor Red
}
Set-Location ..

# Déployer le frontend
Write-Host "🎨 Déploiement du frontend..." -ForegroundColor Cyan
Write-Host "📝 Utilisation de la configuration: railway-frontend.json" -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend déployé avec succès" -ForegroundColor Green
    
    # Récupérer l'URL du frontend
    Write-Host "🌐 Récupération de l'URL du frontend..." -ForegroundColor Yellow
    $frontendUrl = railway domain
    Write-Host "🔗 Frontend URL: $frontendUrl" -ForegroundColor Green
    
} else {
    Write-Host "❌ Erreur lors du déploiement du frontend" -ForegroundColor Red
}

Write-Host "🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host "📱 Vérifiez vos applications sur Railway Dashboard" -ForegroundColor Cyan
Write-Host "🔗 Backend: $backendUrl" -ForegroundColor Green
Write-Host "🔗 Frontend: $frontendUrl" -ForegroundColor Green
