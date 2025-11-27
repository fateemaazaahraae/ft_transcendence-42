FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

RUN npm install

RUN npm rebuild sqlite3 --build-from-source

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "dev" ]