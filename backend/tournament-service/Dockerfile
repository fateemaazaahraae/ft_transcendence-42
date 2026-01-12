FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update && \
apt-get install -y build-essential python3 && \
rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004

CMD [ "npm", "run", "dev" ]
