# Migration vers Supabase - 224Suite

Ce guide vous accompagne dans la migration de votre base de données MySQL vers Supabase (PostgreSQL).

## 🚀 Avantages de Supabase

- **Base de données PostgreSQL** : Plus puissante et flexible que MySQL
- **Authentification intégrée** : Gestion des utilisateurs et sessions
- **API REST automatique** : Générée automatiquement à partir du schéma
- **Row Level Security (RLS)** : Sécurité au niveau des lignes
- **Temps réel** : Mises à jour en temps réel
- **Interface web** : Dashboard pour gérer votre base de données
- **Hébergement cloud** : Pas besoin de serveur de base de données

## 📋 Prérequis

1. Un compte Supabase (gratuit) : [https://supabase.com](https://supabase.com)
2. Node.js installé sur votre machine
3. Les dépendances npm installées

## 🔧 Installation

### 1. Installer les dépendances Supabase

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 2. Créer un projet Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquez sur "New Project"
3. Choisissez votre organisation
4. Donnez un nom à votre projet (ex: "224suite")
5. Choisissez un mot de passe fort pour la base de données
6. Sélectionnez une région proche de vos utilisateurs
7. Cliquez sur "Create new project"

### 3. Configurer les variables d'environnement

1. Copiez le fichier `env.supabase.example` vers `.env.local` :
```bash
cp env.supabase.example .env.local
```

2. Récupérez vos clés depuis le dashboard Supabase :
   - Allez dans Settings > API
   - Copiez l'URL du projet et la clé anonyme

3. Mettez à jour `.env.local` :
```env
REACT_APP_SUPABASE_URL=https://votre-projet-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre-clé-anonyme
```

## 🗄️ Configuration de la base de données

### 1. Exécuter le schéma SQL

```bash
npm run db:setup-supabase
```

Ce script va :
- Créer toutes les tables nécessaires
- Configurer les index et contraintes
- Activer Row Level Security (RLS)
- Créer les politiques de sécurité

### 2. Insérer les données de test

```bash
npm run db:seed-supabase
```

Ce script va :
- Insérer des utilisateurs de test
- Créer des propriétés d'exemple
- Ajouter des images et messages de test

### 3. Tester la connexion

```bash
npm run db:test-supabase
```

## 🔄 Migration des données existantes

Si vous avez des données MySQL existantes à migrer :

### 1. Exporter les données MySQL

```bash
mysqldump -u username -p database_name > backup.sql
```

### 2. Convertir le format (optionnel)

Vous pouvez utiliser des outils comme `pgloader` pour migrer automatiquement :
```bash
pgloader mysql://user:password@localhost/dbname postgresql://postgres:password@localhost:5432/postgres
```

### 3. Importer manuellement

Ou importer manuellement via le dashboard Supabase ou des scripts personnalisés.

## 🔐 Configuration de l'authentification

### 1. Activer l'authentification par email

Dans le dashboard Supabase :
1. Allez dans Authentication > Settings
2. Activez "Enable email confirmations"
3. Configurez les templates d'email si nécessaire

### 2. Configurer les providers (optionnel)

Vous pouvez activer Google, GitHub, etc. dans Authentication > Providers.

## 🚀 Utilisation dans l'application

### 1. Remplacer le service API

Remplacez l'import dans vos composants :
```javascript
// Ancien
import apiService from './services/api-simple.js';

// Nouveau
import apiService from './services/api-supabase.js';
```

### 2. Utiliser le hook d'authentification

Enveloppez votre application avec le provider :
```javascript
import { AuthProvider } from './hooks/useSupabaseAuth';

function App() {
  return (
    <AuthProvider>
      {/* Votre application */}
    </AuthProvider>
  );
}
```

### 3. Utiliser l'authentification dans les composants

```javascript
import { useSupabaseAuth } from './hooks/useSupabaseAuth';

function LoginComponent() {
  const { signIn, signUp, user, loading } = useSupabaseAuth();
  
  // Utiliser les fonctions d'authentification
}
```

## 📊 Monitoring et maintenance

### 1. Dashboard Supabase

Accédez à votre dashboard pour :
- Voir les statistiques d'utilisation
- Monitorer les performances
- Gérer les utilisateurs
- Configurer les politiques RLS

### 2. Logs et debugging

- Logs d'authentification : Authentication > Logs
- Logs de base de données : Logs > Database
- Logs d'API : Logs > API

### 3. Sauvegarde

Supabase effectue des sauvegardes automatiques, mais vous pouvez :
- Exporter vos données via le dashboard
- Configurer des sauvegardes supplémentaires

## 🔒 Sécurité

### 1. Row Level Security (RLS)

Les politiques RLS sont déjà configurées pour :
- Les utilisateurs ne peuvent voir que leurs propres données
- Les propriétés sont visibles par tous
- Les messages sont visibles par les propriétaires des biens

### 2. Clés API

- **Clé anonyme** : Pour le frontend (publique)
- **Clé de service** : Pour le backend (privée)
- **Clé de service role** : Pour les opérations administratives

### 3. Bonnes pratiques

- Ne jamais exposer la clé de service côté client
- Utiliser RLS pour la sécurité des données
- Valider les données côté serveur
- Utiliser HTTPS en production

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion** :
   - Vérifiez les variables d'environnement
   - Vérifiez que le projet Supabase est actif

2. **Erreurs d'authentification** :
   - Vérifiez la configuration des providers
   - Vérifiez les templates d'email

3. **Erreurs de permissions** :
   - Vérifiez les politiques RLS
   - Vérifiez que l'utilisateur est authentifié

### Commandes utiles

```bash
# Tester la connexion
npm run db:test-supabase

# Réinitialiser la base de données
npm run db:setup-supabase

# Réinsérer les données de test
npm run db:seed-supabase
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide PostgreSQL](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API Supabase](https://supabase.com/docs/reference/javascript)

## 🆘 Support

Si vous rencontrez des problèmes :

1. Consultez les logs dans le dashboard Supabase
2. Vérifiez la documentation officielle
3. Consultez les issues GitHub du projet
4. Contactez l'équipe de support Supabase

---

**Note** : Cette migration vous permet de bénéficier de toutes les fonctionnalités modernes de Supabase tout en conservant la compatibilité avec votre application existante.
