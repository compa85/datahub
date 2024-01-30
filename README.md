# DataHub

DataHub è una web application che consente di eseguire le principali operazioni di CRUD (Create, Read, Update, Delete) su un database, attraverso richieste e risposte in formato JSON.

## Tecnologie utilizzate

- **Backend**: Php
- **Frontend**: React
- **Database**: MariaDB

## Requisiti

Assicurati di avere installato [Docker](https://www.docker.com/get-started/) sul tuo sistema prima di continuare.

## Installazione

Per eseguire l'applicazione, segui i passaggi di seguito:

1. Clona il repository:
   ```bash
   git clone https://github.com/compa85/DataHub.git
   cd DataHub
   ```
   
2. Esegui i container
   ```bash
   docker compose up -d
   ```

3. DataHub è ora in esecuzione su http://localhost:3000

   Se vuoi testare unicamente la parte di backend vai a http://localhost:3001
   
   Per invece accedere a phpmyadmin vai a http://localhost:3002