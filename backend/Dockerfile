FROM node:18

# Installation des dépendances système nécessaires à Puppeteer
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  libxss1 \
  libgbm1 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libgtk-3-0 \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie et installation des dépendances Node.js
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# Génération Prisma
RUN npx prisma generate

# Installation de PM2
RUN npm install -g pm2

# Lancement via PM2 avec fichier de configuration
CMD ["pm2-runtime", "ecosystem.config.js"]
