# Configuration de la Base de Données 224Suite

## 🚨 Problème de Connexion Détecté

La connexion à la base de données MySQL en ligne `strategie.o2switch.net` échoue avec un timeout. Voici les solutions possibles :

## 🔧 Solutions Recommandées

### Option 1 : Base de Données Locale (Recommandée pour le développement)

1. **Installer MySQL localement** :
   ```bash
   # Windows (avec Chocolatey)
   choco install mysql
   
   # Ou télécharger depuis https://dev.mysql.com/downloads/mysql/
   ```

2. **Créer la base de données locale** :
   ```sql
   CREATE DATABASE 224suite_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Utiliser la configuration locale** :
   ```bash
   # Copier la configuration locale
   cp database/config-local.js database/config.js
   
   # Configurer la base de données
   npm run db:setup
   npm run db:seed
   ```

### Option 2 : Vérifier la Connexion en Ligne

1. **Vérifier les paramètres de connexion** :
   - Host: `strategie.o2switch.net`
   - Port: `3306`
   - User: `camo7935_224suite`
   - Password: `224Suite@`
   - Database: `camo7935_224suite`

2. **Tester avec un client MySQL** :
   - MySQL Workbench
   - phpMyAdmin
   - DBeaver
   - Ou tout autre client MySQL

3. **Vérifier les paramètres réseau** :
   - Firewall
   - Proxy
   - Connexion internet

### Option 3 : Base de Données Alternative

Si la connexion en ligne ne fonctionne pas, vous pouvez utiliser :

1. **PlanetScale** (MySQL compatible, gratuit) :
   ```bash
   # Créer un compte sur https://planetscale.com/
   # Créer une base de données
   # Récupérer les informations de connexion
   ```

2. **Railway** (MySQL, gratuit) :
   ```bash
   # Créer un compte sur https://railway.app/
   # Créer un service MySQL
   # Récupérer les informations de connexion
   ```

3. **Supabase** (PostgreSQL, gratuit) :
   ```bash
   # Créer un compte sur https://supabase.com/
   # Créer un projet
   # Récupérer les informations de connexion
   ```

## 🚀 Configuration Rapide (Base Locale)

### 1. Installer MySQL
```bash
# Windows
# Télécharger depuis https://dev.mysql.com/downloads/mysql/
# Ou utiliser XAMPP/WAMP

# macOS
brew install mysql

# Linux
sudo apt-get install mysql-server
```

### 2. Démarrer MySQL
```bash
# Windows (XAMPP)
# Démarrer XAMPP et activer MySQL

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 3. Créer la Base de Données
```sql
CREATE DATABASE 224suite_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configurer le Projet
```bash
# Utiliser la configuration locale
cp database/config-local.js database/config.js

# Installer les dépendances
npm install

# Configurer la base de données
npm run db:setup
npm run db:seed

# Démarrer l'application
npm run dev
```

## 🔍 Diagnostic des Problèmes

### Vérifier la Connexion
```bash
# Tester la connexion
node database/test-connection.js

# Tester avec configuration simple
node database/test-connection-simple.js
```

### Vérifier les Paramètres
```bash
# Vérifier les variables d'environnement
echo $DB_HOST
echo $DB_USER
echo $DB_PASSWORD
```

### Vérifier le Réseau
```bash
# Tester la connectivité
ping strategie.o2switch.net
telnet strategie.o2switch.net 3306
```

## 📞 Support

Si vous continuez à avoir des problèmes :

1. **Vérifiez les logs** de votre fournisseur de base de données
2. **Contactez le support** de votre hébergeur
3. **Utilisez une base de données locale** pour le développement
4. **Consultez la documentation** de votre fournisseur

## 🎯 Prochaines Étapes

Une fois la base de données configurée :

1. ✅ Tester la connexion
2. ✅ Créer les tables
3. ✅ Insérer les données de test
4. ✅ Démarrer l'application
5. ✅ Tester les fonctionnalités

## 📋 Checklist de Configuration

- [ ] MySQL installé et démarré
- [ ] Base de données créée
- [ ] Configuration mise à jour
- [ ] Tables créées (`npm run db:setup`)
- [ ] Données de test insérées (`npm run db:seed`)
- [ ] Application démarrée (`npm run dev`)
- [ ] Test de connexion réussi
