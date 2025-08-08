# 🤝 Guide de Contribution - 224Suite

Merci de votre intérêt pour contribuer à 224Suite ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de l'Environnement](#configuration-de-lenvironnement)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapport de Bugs](#rapport-de-bugs)
- [Suggestions de Fonctionnalités](#suggestions-de-fonctionnalités)

## 📜 Code de Conduite

### Notre Engagement

Nous nous engageons à maintenir un environnement ouvert et accueillant pour tous, peu importe l'âge, la taille, le handicap, l'ethnicité, l'identité et l'expression de genre, le niveau d'expérience, la nationalité, l'apparence personnelle, la race, la religion ou l'identité et l'orientation sexuelles.

### Nos Standards

Exemples de comportements qui contribuent à créer un environnement positif :

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres de la communauté

## 🚀 Comment Contribuer

### Types de Contributions

Nous accueillons plusieurs types de contributions :

- **🐛 Corrections de bugs** : Rapport et correction de problèmes
- **✨ Nouvelles fonctionnalités** : Ajout de nouvelles fonctionnalités
- **📚 Documentation** : Amélioration de la documentation
- **🎨 Améliorations UI/UX** : Amélioration de l'interface utilisateur
- **⚡ Optimisations** : Amélioration des performances
- **🧪 Tests** : Ajout de tests unitaires et d'intégration

### Avant de Commencer

1. **Vérifiez les issues existantes** pour éviter les doublons
2. **Discutez des changements majeurs** via une issue
3. **Assurez-vous que votre environnement** est correctement configuré

## ⚙️ Configuration de l'Environnement

### Prérequis

- Node.js 18+
- npm ou yarn
- Git
- MongoDB (locale ou Atlas)
- Compte Cloudinary (optionnel)

### Installation

1. **Fork le repository**
```bash
git clone https://github.com/votre-username/224suite.git
cd 224suite
```

2. **Installation des dépendances**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Configuration des variables d'environnement**
```bash
# Copier les fichiers d'exemple
cp .env.example .env
cp backend/env.example backend/.env
```

4. **Démarrage du développement**
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend
npm run dev
```

## 📏 Standards de Code

### JavaScript/TypeScript

- **ESLint** : Configuration stricte activée
- **Prettier** : Formatage automatique
- **TypeScript** : Typage strict requis
- **Imports** : Imports organisés et nommés

### React

- **Composants fonctionnels** avec hooks
- **Props typées** avec TypeScript
- **Nommage** : PascalCase pour les composants
- **Structure** : Un composant par fichier

### Backend

- **Express.js** : Structure MVC
- **Mongoose** : Modèles avec validation
- **Middleware** : Gestion d'erreurs centralisée
- **Routes** : Organisation par fonctionnalité

### Git

- **Commits** : Messages descriptifs en français
- **Branches** : `feature/nom-fonctionnalite`
- **Pull Requests** : Description détaillée

## 🔄 Processus de Pull Request

### 1. Préparation

```bash
# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos modifications
# ...

# Ajouter les fichiers
git add .

# Commiter avec un message descriptif
git commit -m "feat: ajouter nouvelle fonctionnalité de recherche avancée"
```

### 2. Tests

```bash
# Tests frontend
npm test

# Tests backend
cd backend
npm test
cd ..

# Build de production
npm run build
```

### 3. Soumission

```bash
# Pousser vers votre fork
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request sur GitHub
```

### 4. Template de Pull Request

```markdown
## 📝 Description
Brève description des changements apportés.

## 🎯 Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Amélioration de la documentation
- [ ] Refactoring
- [ ] Test

## 🧪 Tests
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Build de production réussi

## 📸 Captures d'écran (si applicable)
Ajoutez des captures d'écran pour les changements UI.

## ✅ Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests pour les nouvelles fonctionnalités
```

## 🐛 Rapport de Bugs

### Template de Bug Report

```markdown
## 🐛 Description du Bug
Description claire et concise du bug.

## 🔄 Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

## ✅ Comportement Attendu
Description de ce qui devrait se passer.

## 📱 Informations Système
- OS : [ex: Windows 10]
- Navigateur : [ex: Chrome 91]
- Version : [ex: 1.0.0]

## 📸 Captures d'écran
Ajoutez des captures d'écran si applicable.

## 📋 Contexte Additionnel
Toute autre information pertinente.
```

## 💡 Suggestions de Fonctionnalités

### Template de Feature Request

```markdown
## 🚀 Description
Description claire et concise de la fonctionnalité souhaitée.

## 🎯 Problème Résolu
Explication du problème que cette fonctionnalité résoudrait.

## 💭 Solution Proposée
Description de la solution souhaitée.

## 🔄 Alternatives Considérées
Autres solutions que vous avez considérées.

## 📋 Contexte Additionnel
Toute autre information pertinente.
```

## 🏷️ Labels et Milestones

### Labels Utilisés

- `bug` : Problème à corriger
- `enhancement` : Amélioration
- `feature` : Nouvelle fonctionnalité
- `documentation` : Documentation
- `good first issue` : Bon pour débuter
- `help wanted` : Aide recherchée
- `priority: high` : Priorité élevée
- `priority: low` : Priorité faible

## 📞 Support

### Questions et Discussions

- **Issues GitHub** : Pour les bugs et fonctionnalités
- **Discussions GitHub** : Pour les questions générales
- **Email** : support@224suite.gn

### Ressources

- **Documentation** : [docs.224suite.gn](https://docs.224suite.gn)
- **API Reference** : [api.224suite.gn](https://api.224suite.gn)
- **Design System** : [design.224suite.gn](https://design.224suite.gn)

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent 224Suite meilleur chaque jour !

---

**Ensemble, construisons l'avenir de l'immobilier à Conakry ! 🏠🇬🇳**
