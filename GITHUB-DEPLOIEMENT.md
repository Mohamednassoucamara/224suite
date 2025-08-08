# 🚀 Guide de Déploiement sur GitHub - 224Suite

## 📋 Étapes pour Déposer le Projet sur GitHub

### **1. Création du Repository GitHub**

1. **Aller sur GitHub.com** et se connecter
2. **Cliquer sur "New repository"** (bouton vert)
3. **Configurer le repository :**
   - **Repository name** : `224suite`
   - **Description** : `Plateforme immobilière moderne pour Conakry, Guinée`
   - **Visibility** : Public (recommandé) ou Private
   - **Ne PAS initialiser** avec README, .gitignore ou licence (déjà présents)

### **2. Connexion du Repository Local à GitHub**

```bash
# Ajouter le remote origin (remplacer YOUR_USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/YOUR_USERNAME/224suite.git

# Vérifier que le remote a été ajouté
git remote -v

# Pousser le code vers GitHub
git push -u origin main
```

### **3. Configuration des GitHub Pages (Optionnel)**

Si vous voulez héberger le site sur GitHub Pages :

1. **Aller dans Settings** du repository
2. **Scroller vers "Pages"** dans le menu de gauche
3. **Source** : Sélectionner "Deploy from a branch"
4. **Branch** : Sélectionner "main" et "/docs"
5. **Cliquer "Save"**

### **4. Configuration des GitHub Actions (CI/CD)**

Créer le fichier `.github/workflows/deploy.yml` :

```yaml
name: Deploy 224Suite

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

### **5. Configuration des Secrets GitHub**

Dans les **Settings** du repository → **Secrets and variables** → **Actions** :

- `VERCEL_TOKEN` : Token d'API Vercel
- `ORG_ID` : ID de l'organisation Vercel
- `PROJECT_ID` : ID du projet Vercel

### **6. Configuration des Issues et Discussions**

#### **Activer les Discussions :**
1. **Settings** → **Features**
2. **Activer "Discussions"**

#### **Configurer les Templates d'Issues :**

Créer `.github/ISSUE_TEMPLATE/bug_report.md` :
```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10]
 - Browser: [e.g. Chrome 91]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### **7. Configuration du README GitHub**

Le README.md est déjà configuré avec :
- ✅ Badges de statut
- ✅ Description complète
- ✅ Instructions d'installation
- ✅ Structure du projet
- ✅ API endpoints
- ✅ Guide de contribution

### **8. Configuration des Labels**

Créer des labels personnalisés :
- `bug` : Problèmes à corriger
- `enhancement` : Améliorations
- `feature` : Nouvelles fonctionnalités
- `documentation` : Documentation
- `good first issue` : Bon pour débuter
- `help wanted` : Aide recherchée
- `priority: high` : Priorité élevée
- `priority: low` : Priorité faible

### **9. Configuration des Branches**

#### **Protection de la branche main :**
1. **Settings** → **Branches**
2. **Add rule** pour `main`
3. **Configurer :**
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### **10. Configuration des Collaborateurs**

#### **Ajouter des collaborateurs :**
1. **Settings** → **Collaborators and teams**
2. **Add people**
3. **Inviter par email ou nom d'utilisateur**

### **11. Configuration des Webhooks (Optionnel)**

Pour l'intégration avec d'autres services :
1. **Settings** → **Webhooks**
2. **Add webhook**
3. **Configurer les URLs et événements**

## 🔧 Commandes Git Utiles

### **Gestion des Branches**
```bash
# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Basculer entre branches
git checkout main

# Fusionner une branche
git merge feature/nouvelle-fonctionnalite

# Supprimer une branche
git branch -d feature/nouvelle-fonctionnalite
```

### **Gestion des Commits**
```bash
# Voir l'historique
git log --oneline

# Annuler le dernier commit
git reset --soft HEAD~1

# Modifier le message du dernier commit
git commit --amend -m "Nouveau message"
```

### **Synchronisation**
```bash
# Récupérer les changements
git pull origin main

# Pousser les changements
git push origin main

# Voir les différences
git diff
```

## 📊 Métriques GitHub

### **Statistiques du Repository**
- **Stars** : Popularité du projet
- **Forks** : Copies du projet
- **Issues** : Problèmes et demandes
- **Pull Requests** : Contributions

### **Insights**
- **Traffic** : Visites du repository
- **Contributors** : Contributeurs
- **Commits** : Activité de développement
- **Releases** : Versions publiées

## 🚀 Déploiement Automatique

### **Avec Vercel :**
1. **Connecter le repository GitHub à Vercel**
2. **Configurer les variables d'environnement**
3. **Déploiement automatique à chaque push**

### **Avec Netlify :**
1. **Connecter le repository GitHub à Netlify**
2. **Configurer le build command :** `npm run build`
3. **Configurer le publish directory :** `build`

## 📞 Support et Maintenance

### **Monitoring**
- **GitHub Actions** : Statut des déploiements
- **Dependabot** : Mises à jour automatiques
- **Security alerts** : Vulnérabilités détectées

### **Backup**
- **GitHub** : Sauvegarde automatique
- **Cloner localement** : `git clone https://github.com/YOUR_USERNAME/224suite.git`

---

## ✅ Checklist de Déploiement

- [ ] Repository GitHub créé
- [ ] Code poussé vers GitHub
- [ ] README.md configuré
- [ ] Issues templates créés
- [ ] Labels configurés
- [ ] Protection de branche activée
- [ ] Collaborateurs ajoutés
- [ ] GitHub Actions configurées
- [ ] Secrets configurés
- [ ] Déploiement automatique activé

**🎉 Votre projet 224Suite est maintenant sur GitHub !**

**Lien du repository :** `https://github.com/YOUR_USERNAME/224suite`
