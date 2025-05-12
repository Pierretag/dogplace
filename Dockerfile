# Étape 1 : build avec TypeScript
FROM node:20 AS builder

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Installe les dépendances
RUN npm install

# Compile le code TypeScript en JavaScript
RUN npm run build

# Étape 2 : image de production
FROM node:20-alpine

WORKDIR /app

# Copie uniquement le build et les fichiers nécessaires
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installe uniquement les dépendances de production
RUN npm install --only=production

# Expose le port
EXPOSE 8000

# Démarre le serveur
CMD ["node", "dist/server.js"]
