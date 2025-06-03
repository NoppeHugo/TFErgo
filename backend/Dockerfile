FROM node:18

WORKDIR /app

# Copie et installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# Installation de PM2 globalement
RUN npm install -g pm2

# Lancement via pm2
CMD ["pm2-runtime", "ecosystem.config.js"]