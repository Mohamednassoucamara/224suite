# 🚀 Installation rapide PostgreSQL pour 224Suite

## ⚡ Installation en 5 minutes

### Option 1: Docker (Recommandé pour le développement)

```bash
# Installer Docker Desktop depuis https://www.docker.com/products/docker-desktop/

# Créer et démarrer PostgreSQL
docker run --name 224suite-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=224suite_dev \
  -p 5432:5432 \
  -d postgres:15

# Vérifier que le conteneur fonctionne
docker ps

# Se connecter à la base
docker exec -it 224suite-postgres psql -U postgres -d 224suite_dev
```

### Option 2: Installation native Windows

```bash
# Avec Chocolatey
choco install postgresql

# Ou télécharger depuis https://www.postgresql.org/download/windows/
# Installer avec le mot de passe: password
```

### Option 3: Utiliser Railway (Base de données cloud)

1. Allez sur https://railway.app/
2. Créez un compte et un projet
3. Ajoutez une base de données PostgreSQL
4. Copiez l'URL de connexion
5. Ajoutez `DATABASE_URL=postgresql://...` dans votre `.env`

## 🔧 Configuration rapide

### 1. Copier l'environnement PostgreSQL

```bash
cp env.postgresql .env
```

### 2. Modifier .env selon votre installation

```env
# Pour Docker (défaut)
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=224suite_dev
DB_HOST=127.0.0.1
DB_PORT=5432

# Pour Railway
DATABASE_URL=postgresql://user:pass@host:port/database
```

### 3. Tester la connexion

```bash
npm run db:test
```

### 4. Créer les tables

```bash
npm run db:migrate
```

### 5. Ajouter des données de test

```bash
npm run db:seed
```

## 🧪 Test complet

```bash
# 1. Tester la connexion
npm run db:test

# 2. Créer les tables
npm run db:migrate

# 3. Démarrer le serveur
npm start

# 4. Tester les endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/test-postgresql
```

## 🚨 Résolution des problèmes courants

### Erreur "ECONNREFUSED"
- PostgreSQL n'est pas démarré
- Mauvais port (vérifiez 5432)
- Firewall bloque la connexion

### Erreur "28P01" (Authentification)
- Mauvais mot de passe
- Vérifiez pg_hba.conf

### Erreur "3D000" (Base introuvable)
- Base de données non créée
- Mauvais nom de base

## 🎯 Prochaines étapes

Une fois PostgreSQL configuré :

1. ✅ Tester la connexion
2. ✅ Créer les tables
3. ✅ Démarrer le serveur
4. ✅ Tester l'API
5. ✅ Migrer les données existantes (si applicable)

## 💡 Astuces

- **Docker** : Plus simple pour le développement
- **Railway** : Plus simple pour la production
- **Native** : Meilleure performance, plus complexe à configurer

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les logs : `docker logs 224suite-postgres`
3. Vérifiez la configuration dans `.env`
4. Testez avec `psql` ou un client graphique
