FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

RUN npm install --build-from-source sqlite3 && npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "dev" ]