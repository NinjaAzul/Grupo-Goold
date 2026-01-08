FROM node:18-alpine

# Instalar dependências necessárias para compilar módulos nativos (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3001

# Para desenvolvimento, o comando será sobrescrito pelo docker-compose
CMD ["npm", "run", "dev"]

