FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3001

# Para desenvolvimento, o comando será sobrescrito pelo docker-compose
CMD ["npm", "run", "dev"]

