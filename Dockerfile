FROM node:18-alpine

# Copier les fichiers de configuration
COPY package*.json ./
COPY .nixpacks/ .nixpacks/

# Installer les dépendances
RUN npm ci --only=production

# Copier le code du backend
COPY backend/ ./backend/

# Changer vers le répertoire backend
WORKDIR /app/backend

# Exposer le port
EXPOSE 5000

# Démarrer le serveur backend
CMD ["npm", "start"]
