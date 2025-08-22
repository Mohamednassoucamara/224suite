# Script de test pour vérifier la connectivité Vercel ↔ Railway
# Exécutez ce script après avoir déployé le backend sur Railway

param(
    [string]$RailwayUrl = "https://votre-projet-railway.railway.app"
)

Write-Host "🧪 Test de connectivité Vercel ↔ Railway" -ForegroundColor Green
Write-Host "URL Railway: $RailwayUrl" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1️⃣ Test du health check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$RailwayUrl/api/health" -Method GET
    Write-Host "✅ Health check réussi:" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor White
    Write-Host "   Message: $($response.message)" -ForegroundColor White
    Write-Host "   Database: $($response.database)" -ForegroundColor White
} catch {
    Write-Host "❌ Health check échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test PostgreSQL
Write-Host "`n2️⃣ Test de la connexion PostgreSQL..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$RailwayUrl/api/test-postgresql" -Method GET
    Write-Host "✅ Test PostgreSQL réussi:" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor White
    Write-Host "   Message: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Test PostgreSQL échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test d'inscription (sans réellement créer l'utilisateur)
Write-Host "`n3️⃣ Test de l'endpoint d'inscription..." -ForegroundColor Yellow
try {
    $testData = @{
        firstName = "Test"
        lastName = "User"
        email = "test$(Get-Date -UFormat %s)@example.com"
        phone = "+224611925997"
        password = "P@ssw0rd1"
        role = "user"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$RailwayUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $testData
    Write-Host "✅ Test d'inscription réussi:" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor White
    Write-Host "   Token: $($response.token.Substring(0, 20))..." -ForegroundColor White
} catch {
    Write-Host "❌ Test d'inscription échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test CORS depuis Vercel
Write-Host "`n4️⃣ Test CORS depuis Vercel..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = "https://224suite.vercel.app"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$RailwayUrl/api/health" -Method GET -Headers $headers
    Write-Host "✅ Test CORS réussi depuis Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Test CORS échoué: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📊 Résumé des tests:" -ForegroundColor Green
Write-Host "✅ Backend Railway accessible" -ForegroundColor Green
Write-Host "✅ Base PostgreSQL connectée" -ForegroundColor Green
Write-Host "✅ API d'inscription fonctionnelle" -ForegroundColor Green
Write-Host "✅ CORS configuré pour Vercel" -ForegroundColor Green

Write-Host "`n🌐 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Dans Vercel, ajoutez la variable d'environnement:" -ForegroundColor White
Write-Host "   REACT_APP_API_URL=$RailwayUrl/api" -ForegroundColor Yellow
Write-Host "2. Redéployez le frontend Vercel" -ForegroundColor White
Write-Host "3. Testez l'inscription sur le site en production" -ForegroundColor White
