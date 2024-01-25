FROM node:latest

# impostare la working directory
WORKDIR /app

# installare le dipendenze
COPY frontend/package.json .
RUN npm install

# copiare il codice sorgente
COPY frontend/ .