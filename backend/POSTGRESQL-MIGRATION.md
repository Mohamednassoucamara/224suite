# Migration de MongoDB vers PostgreSQL

Ce document décrit la migration complète de MongoDB vers PostgreSQL pour le projet 224Suite.

## 🎯 Objectifs de la migration

- **Performance** : Amélioration des requêtes complexes et des jointures
- **Fiabilité** : Transactions ACID complètes
- **Relations** : Gestion native des relations entre entités
- **Requêtes** : Support SQL avancé et optimisations
- **Évolutivité** : Meilleure gestion des données structurées

## 📋 Prérequis

### 1. Installation de PostgreSQL

#### Windows
```bash
# Télécharger depuis https://www.postgresql.org/download/windows/
# Ou utiliser Chocolatey
choco install postgresql
```

#### macOS
```bash
# Avec Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configuration PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE 224suite_dev;

# Créer un utilisateur (optionnel)
CREATE USER 224suite_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE 224suite_dev TO 224suite_user;

# Quitter
\q
```

## 🚀 Installation des dépendances

```bash
cd backend
npm install pg sequelize sequelize-cli
npm uninstall mongoose
```

## ⚙️ Configuration

### 1. Variables d'environnement

Copiez `env.postgresql` vers `.env` :

```bash
cp env.postgresql .env
```

Modifiez `.env` selon votre configuration :

```env
# Base de données PostgreSQL
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=224suite_dev
DB_HOST=127.0.0.1
DB_PORT=5432
```

### 2. Configuration Sequelize

Le fichier `config/database.js` est déjà configuré pour :
- **Development** : Base locale
- **Test** : Base de test
- **Production** : Variable d'environnement `DATABASE_URL`

## 🗄️ Structure de la base de données

### Tables créées

1. **users** - Utilisateurs du système
2. **properties** - Propriétés immobilières
3. **appointments** - Rendez-vous de visite
4. **messages** - Messages entre utilisateurs
5. **subscriptions** - Abonnements premium

### Relations

- `User` ↔ `Property` (1:N) - Un utilisateur peut avoir plusieurs propriétés
- `User` ↔ `Appointment` (1:N) - Un utilisateur peut avoir plusieurs rendez-vous
- `Property` ↔ `Appointment` (1:N) - Une propriété peut avoir plusieurs rendez-vous
- `User` ↔ `Message` (1:N) - Un utilisateur peut envoyer/recevoir plusieurs messages

## 🔄 Migration des données

### 1. Exécuter les migrations

```bash
# Créer les tables
npx sequelize-cli db:migrate

# Annuler la dernière migration (si nécessaire)
npx sequelize-cli db:migrate:undo

# Annuler toutes les migrations
npx sequelize-cli db:migrate:undo:all
```

### 2. Synchronisation automatique

Le serveur utilise `sequelize.sync({ alter: true })` pour :
- Créer automatiquement les tables manquantes
- Mettre à jour la structure des tables existantes
- Maintenir la cohérence du schéma

## 🧪 Tests

### 1. Test de connexion

```bash
node test-postgresql-connection.js
```

### 2. Test du serveur

```bash
npm start
```

Vérifiez les endpoints :
- `GET /api/health` - Santé du serveur
- `GET /api/test-postgresql` - Test de la base de données

## 📊 Avantages de PostgreSQL

### vs MongoDB

| Aspect | MongoDB | PostgreSQL |
|--------|---------|------------|
| **Relations** | Références manuelles | Clés étrangères natives |
| **Requêtes** | Agrégation complexe | SQL standard |
| **Transactions** | Multi-documents | ACID complètes |
| **Schéma** | Flexible | Structuré |
| **Performance** | Lectures simples | Requêtes complexes |
| **Intégrité** | Application | Base de données |

### Fonctionnalités PostgreSQL utilisées

- **JSONB** : Stockage flexible des données (features, amenities, metadata)
- **GEOMETRY** : Support des coordonnées géographiques
- **ENUM** : Contraintes sur les valeurs possibles
- **Index GIST** : Recherche géospatiale optimisée
- **UUID** : Identifiants uniques universels

## 🚨 Résolution des problèmes

### Erreur de connexion

```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Vérifier le port
sudo netstat -tlnp | grep 5432
```

### Erreur d'authentification

```bash
# Modifier pg_hba.conf pour l'authentification locale
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Base de données introuvable

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base
CREATE DATABASE 224suite_dev;

# Vérifier
\l
```

## 🔧 Maintenance

### Sauvegarde

```bash
# Sauvegarde complète
pg_dump 224suite_dev > backup_$(date +%Y%m%d).sql

# Restauration
psql 224suite_dev < backup_20231201.sql
```

### Optimisation

```bash
# Analyser les performances
EXPLAIN ANALYZE SELECT * FROM properties WHERE type = 'apartment';

# VACUUM et ANALYZE
VACUUM ANALYZE;
```

## 📚 Ressources

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation Sequelize](https://sequelize.org/)
- [Guide des migrations](https://sequelize.org/docs/v6/other-topics/migrations/)

## ✅ Checklist de migration

- [ ] PostgreSQL installé et configuré
- [ ] Base de données créée
- [ ] Variables d'environnement configurées
- [ ] Dépendances installées
- [ ] Migrations exécutées
- [ ] Tests de connexion réussis
- [ ] Serveur démarré avec PostgreSQL
- [ ] Anciens fichiers MongoDB supprimés
- [ ] Documentation mise à jour

## 🎉 Migration terminée !

Votre projet 224Suite utilise maintenant PostgreSQL avec Sequelize. Profitez des avantages d'une base de données relationnelle robuste et performante !
