param(
  [string]$SupabaseUrl,
  [string]$SupabaseAnonKey,
  [switch]$PreviewOnly
)

Write-Host "🚀 Déploiement 224Suite sur Vercel..." -ForegroundColor Green

# Vérifier que Vercel CLI est installé
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI n'est pas installé. Installation..." -ForegroundColor Red
    npm install -g vercel
}

# Lier le projet au dossier courant si nécessaire (non interactif si déjà lié)
Write-Host "🔗 Liaison du projet Vercel (si nécessaire)..." -ForegroundColor Yellow
vercel link --yes | Out-Null

# Récupérer les valeurs si non fournies en paramètre (invite sécurisée)
if (-not $SupabaseUrl) {
  $SupabaseUrl = Read-Host "Entrez REACT_APP_SUPABASE_URL (ex: https://xxxx.supabase.co)"
}
if (-not $SupabaseAnonKey) {
  $SupabaseAnonKey = Read-Host "Entrez REACT_APP_SUPABASE_ANON_KEY (clé anon publique)"
}

# Configurer les variables d'environnement Supabase pour Preview et Production
Write-Host "⚙️ Configuration des variables d'environnement Supabase..." -ForegroundColor Yellow

# Preview
cmd /c "echo $SupabaseUrl | vercel env add REACT_APP_SUPABASE_URL preview" | Out-Null
cmd /c "echo $SupabaseAnonKey | vercel env add REACT_APP_SUPABASE_ANON_KEY preview" | Out-Null

# Production
cmd /c "echo $SupabaseUrl | vercel env add REACT_APP_SUPABASE_URL production" | Out-Null
cmd /c "echo $SupabaseAnonKey | vercel env add REACT_APP_SUPABASE_ANON_KEY production" | Out-Null

# Optionnel: forcer NODE_ENV
cmd /c "echo production | vercel env add NODE_ENV production" | Out-Null

Write-Host "✅ Variables d'environnement Supabase configurées" -ForegroundColor Green

# Construire l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
npm run build

# Déployer
if ($PreviewOnly) {
  Write-Host "🚀 Déploiement en prévisualisation..." -ForegroundColor Yellow
  vercel --prebuilt | Out-Null
} else {
  Write-Host "🚀 Déploiement en production..." -ForegroundColor Yellow
  vercel --prebuilt --prod | Out-Null
}

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Vérifiez votre projet dans le dashboard Vercel" -ForegroundColor Cyan
