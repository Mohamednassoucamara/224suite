#!/bin/bash

echo "🚀 Déploiement du Backend 224Suite"

# Vérification des variables d'environnement
if [ -z "$MONGODB_URI" ]; then
    echo "❌ Erreur: MONGODB_URI n'est pas définie"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Erreur: JWT_SECRET n'est pas définie"
    exit 1
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Tests
echo "🧪 Exécution des tests..."
npm test

# Démarrage du serveur
echo "🌐 Démarrage du serveur..."
npm start
