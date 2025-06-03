# ===== Étape 1 : Build de l'app React =====
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Construire l'application
RUN npm run build


# ===== Étape 2 : Serve de l'app construite =====
FROM node:18-alpine

# Installer 'serve' pour servir une app statique
RUN npm install -g serve

# Créer le dossier de travail
WORKDIR /app

# Copier le build généré depuis l'étape précédente
COPY --from=build /app/build ./build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["serve", "-s", "build", "-l", "3000"]