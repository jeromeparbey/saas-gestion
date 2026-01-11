FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le code
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Compiler TypeScript
RUN npm run build

# Port backend
EXPOSE 4000

# Lancer l'application
CMD ["npm", "run", "start"]
