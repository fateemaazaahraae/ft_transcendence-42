FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

# Install tools required to compile native Node modules (like sqlite3)
# The 'sqlite3' package typically requires 'build-essential' and sometimes 'python'
RUN apt-get update && \
    apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

# Install all dependencies
RUN npm install

# Rebuild sqlite3 explicitly for the running architecture
RUN npm rebuild sqlite3 --build-from-source

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]