# Script de déploiement Vercel simplifié
Write-Host "🚀 Déploiement Backend 224Suite sur Vercel..." -ForegroundColor Green

# Vérifier que Vercel CLI est installé
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI détecté: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI non trouvé. Installation..." -ForegroundColor Red
    npm install -g vercel
}

# Copier le package.json Vercel dans le backend
Write-Host "📦 Configuration du package.json Vercel..." -ForegroundColor Yellow
Copy-Item "backend\package.vercel.json" "backend\package.json" -Force

# Aller dans le répertoire backend et installer les dépendances
Write-Host "📥 Installation des dépendances..." -ForegroundColor Yellow
Set-Location backend
npm install

# Retourner au répertoire racine
Set-Location ..

# Déployer sur Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host "🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Copier l'URL de déploiement" -ForegroundColor White
Write-Host "   2. Mettre à jour REACT_APP_API_URL sur le frontend Vercel" -ForegroundColor White
Write-Host "   3. Tester l'API backend" -ForegroundColor White
Write-Host "   4. Tester l'inscription utilisateur" -ForegroundColor White
