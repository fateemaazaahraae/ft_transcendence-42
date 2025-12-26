FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update && \
apt-get install -y build-essential python3 && \
rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --build-from-source=sqlite3

COPY . .

EXPOSE 3003

CMD [ "npm", "run", "dev" ]