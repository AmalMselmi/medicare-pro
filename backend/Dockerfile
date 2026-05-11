# Image de base Node.js
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tout le code
COPY . .

# Créer le dossier uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 5000

# Lancer l'application
CMD ["node", "app.js"]