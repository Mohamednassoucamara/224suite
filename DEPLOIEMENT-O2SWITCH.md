# 🚀 Guide de Déploiement 224Suite sur O2switch

## 📋 Prérequis

### **Hébergement O2switch**
- **Hébergement Pro** : 5,90€/mois (frontend uniquement)
- **VPS 4GB** : 19,90€/mois (solution complète)
- **Domaine** : Inclus dans l'hébergement

### **Services Externes**
- **MongoDB Atlas** : Base de données (gratuit pour commencer)
- **Cloudinary** : Gestion des images (gratuit 25GB/mois)
- **Stripe** : Paiements (2.9% + 30¢ par transaction)

## 🎯 Option 1 : Frontend sur O2switch + Backend Externe

### **Étapes de Déploiement Frontend**

#### **1. Préparation des Fichiers**
```bash
# Build de production
npm run build

# Le dossier 'build' contient tous les fichiers à uploader
```

#### **2. Upload sur O2switch**
1. **Connexion FTP** à votre hébergement O2switch
2. **Upload** du contenu du dossier `build/` vers `public_html/`
3. **Upload** du fichier `.htaccess` vers `public_html/`

#### **3. Configuration du Domaine**
- **Domaine principal** : `www.224suite.gn`
- **Sous-domaine API** : `api.224suite.gn` (pointant vers le backend externe)

### **Backend Externe (Railway/Render)**

#### **Déploiement sur Railway**
```bash
# Installation Railway CLI
npm install -g @railway/cli

# Connexion et déploiement
railway login
railway init
railway up
```

#### **Variables d'Environnement Backend**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/224suite
JWT_SECRET=votre_jwt_secret_tres_securise
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
FRONTEND_URL=https://www.224suite.gn
```

#### **Configuration Frontend**
```env
REACT_APP_API_URL=https://api.224suite.gn
REACT_APP_CLOUDINARY_CLOUD_NAME=votre_cloud_name
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🎯 Option 2 : Solution Complète sur VPS O2switch

### **Configuration du VPS**

#### **1. Installation des Prérequis**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation PM2
sudo npm install -g pm2

# Installation Nginx
sudo apt install nginx -y

# Installation MongoDB (optionnel, Atlas recommandé)
sudo apt install mongodb -y
```

#### **2. Configuration Nginx**
```bash
# Création du fichier de configuration
sudo nano /etc/nginx/sites-available/224suite
```

**Contenu du fichier Nginx :**
```nginx
server {
    listen 80;
    server_name www.224suite.gn 224suite.gn;
    
    # Frontend (fichiers statiques)
    location / {
        root /var/www/224suite/build;
        try_files $uri $uri/ /index.html;
        
        # Cache pour les assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### **3. Activation du Site**
```bash
# Création du lien symbolique
sudo ln -s /etc/nginx/sites-available/224suite /etc/nginx/sites-enabled/

# Test de la configuration
sudo nginx -t

# Redémarrage de Nginx
sudo systemctl restart nginx
```

#### **4. Déploiement de l'Application**
```bash
# Création du dossier de l'application
sudo mkdir -p /var/www/224suite
sudo chown $USER:$USER /var/www/224suite

# Upload des fichiers (via FTP ou Git)
cd /var/www/224suite

# Installation des dépendances backend
cd backend
npm install --production

# Installation des dépendances frontend
cd ../frontend
npm install --production
npm run build

# Configuration PM2
cd ../backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### **5. Configuration SSL (Let's Encrypt)**
```bash
# Installation Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtention du certificat SSL
sudo certbot --nginx -d www.224suite.gn -d 224suite.gn

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuration des Services

### **MongoDB Atlas**
1. **Création du cluster** sur MongoDB Atlas
2. **Configuration réseau** : IP 0.0.0.0/0 (toutes les IPs)
3. **Création de l'utilisateur** avec mot de passe sécurisé
4. **Récupération de l'URI** de connexion

### **Cloudinary**
1. **Création du compte** sur Cloudinary
2. **Récupération des clés** API
3. **Configuration des transformations** automatiques

### **Stripe**
1. **Création du compte** Stripe
2. **Configuration des webhooks**
3. **Test des paiements** en mode sandbox

## 📊 Monitoring et Maintenance

### **PM2 Monitoring**
```bash
# Statut des processus
pm2 status

# Logs en temps réel
pm2 logs 224suite-backend

# Redémarrage de l'application
pm2 restart 224suite-backend
```

### **Nginx Monitoring**
```bash
# Statut du service
sudo systemctl status nginx

# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

### **Sauvegardes Automatiques**
```bash
# Script de sauvegarde
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/224suite"

# Sauvegarde des fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/224suite

# Sauvegarde de la base de données (si locale)
mongodump --out $BACKUP_DIR/db_$DATE

# Nettoyage des anciennes sauvegardes (garde 7 jours)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "db_*" -mtime +7 -exec rm -rf {} \;
```

## 💰 Estimation des Coûts

### **Option 1 : Frontend O2switch + Backend Externe**
- **O2switch Pro** : 5,90€/mois
- **Railway Backend** : 5$/mois (~4,50€)
- **MongoDB Atlas** : Gratuit (512MB)
- **Cloudinary** : Gratuit (25GB)
- **Total** : ~10,40€/mois

### **Option 2 : VPS O2switch Complet**
- **VPS 4GB** : 19,90€/mois
- **MongoDB Atlas** : Gratuit (512MB)
- **Cloudinary** : Gratuit (25GB)
- **Total** : ~19,90€/mois

## 🚀 Avantages de l'Hébergement O2switch

### **✅ Points Forts**
- **Support français** : Assistance en français
- **Performance** : Serveurs en France
- **Sécurité** : Protection DDoS incluse
- **SSL gratuit** : Certificats Let's Encrypt
- **Backup automatique** : Sauvegardes quotidiennes
- **Monitoring** : Outils de surveillance inclus

### **⚠️ Points d'Attention**
- **Configuration technique** : Nécessite des compétences Linux
- **Maintenance** : Mises à jour manuelles requises
- **Scalabilité** : Limitation selon le plan choisi

## 📞 Support et Assistance

### **O2switch Support**
- **Téléphone** : 04 26 78 36 00
- **Email** : support@o2switch.fr
- **Chat** : Disponible sur le panel client
- **Documentation** : Wiki technique complet

### **Documentation 224Suite**
- **GitHub** : Code source et documentation
- **API Docs** : Documentation des endpoints
- **Troubleshooting** : Guide de résolution des problèmes

---

**🎯 Recommandation** : Commencez avec l'Option 1 (frontend O2switch + backend externe) pour tester le marché, puis migrez vers l'Option 2 (VPS complet) selon la croissance de votre plateforme.
