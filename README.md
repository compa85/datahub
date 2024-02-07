# DataHub

DataHub è una web application, sviluppata a scopo didattico, che consente di eseguire le principali operazioni di CRUD (Create, Read, Update, Delete) su un database, attraverso richieste e risposte in formato JSON.

## Tecnologie utilizzate

- **Frontend**: React
- **Backend**: Php
- **Database**: MariaDB

## Configurazione

### Requisiti

Assicurati di avere installato [Docker](https://www.docker.com/get-started/) sul tuo sistema prima di continuare.

### Installazione

Dopo aver clonato il repository con:
```bash
git clone https://github.com/compa85/DataHub.git
```
esegui i seguenti comandi:
   
```bash
cd DataHub
docker compose up -d
```

DataHub è ora in esecuzione su http://localhost:3000

Se vuoi testare unicamente la parte di backend vai a http://localhost:3001
   
Per accedere invece a phpmyadmin vai a http://localhost:3002

## Api

Le API che permettono di interagire con il database si trovano all'indirizzo http://localhost:3001/api e sono le seguenti:

- select.php
- insert.php
- update.php
- delete.php
- getcolumns.php
- getlastid.php

## Json

### Richiesta

La struttura del JSON può variare a seconda della query che si desidera eseguire. Di seguito sono riportati i vari esempi.

Ogni JSON deve contenere una o più tabelle del database, rappresentate come un attributo dell'oggetto principale.


<details>
<summary>Insert</summary>

Per ogni tabella, vi è un array di oggetti, i quali rappresentano i record da inserire.

All'interno di ciascun oggetto, sono definiti i campi che costituiscono i record del database. Ogni campo è rappresentato da una coppia di chiave-valore, dove la chiave corrisponde al nome del campo e il valore è il dato da inserire.

Per evitare errori, assicurati che all'interno della stessa tabella ogni oggetto da inserire abbia gli stessi attributi.
   
```json
{
   "customers": [
      {
         "first_name": "John",
         "last_name": "Doe",
         "email": "john@example.com"
      },
      {
         "first_name": "Jane",
         "last_name": "Smith",
         "email": "jane@example.com"
      }
   ]
}
```

Con questo JSON vengono aggiunti due nuovi clienti John e Jane.

</details>

<details>
<summary>Update</summary>
   
L'array corrispondente al nome della tabella contiene uno o più sottoarray che rappresentano i record da aggiornare. Ciascun sottoarray deve contenere due oggetti:

1. Il primo contiene i campi da usare come criteri di ricerca per individuare i record da aggiornare.
2. Il secondo contiene i campi da aggiornare con i nuovi valori desiderati.

```json
{
   "customers": [
      [
         {
            "id": "47"
         },
         {
            "email": "jane@example.com"
         }
      ]
   ]
}
```

Con questo JSON viene aggiornata l'email del cliente con id 47.

</details>

<details>
<summary>Delete</summary>

L'array corrispondente al nome della tabella, contiene gli oggetti che rappresentano i criteri per individuare i record da eliminare. Si consiglia di utilizzare le chiavi primarie per identificare i record da eliminare.

Se l'array dovesse essere vuoto, tutti i record della tabella verranno eliminati.
   
```json
{
   "orders": [
      {
         "id": "31",
      },
      {
         "date": "2024-01-01"
      }
   ]
}
```

Con questo JSON viene eliminato l'ordine con id 31 e vengono eliminati anche tutti gli ordini effettutati in data 2024-01-01.

</details>


### Risposta

Il seguente JSON rappresenta un esempio di risposta fornita in seguito ad un'operazione di select.

```json
{
   "status": "ok",
   "message": "2 records selected",
   "query": ["SELECT * FROM customers"],
   "result": [
      [
         {"first_name": "Mario", "last_name": "Rossi"},
         {"first_name": "Giovanni", "last_name": "Verdi"}
      ]
   ]
}
```

- `status` (string) → riporta se l'esecuzione dell'operazione è andata a buon fine o meno: "ok" se è stata completata con successo o "error" se si è verificato un errore
- `message` (string) → riporta delle informazioni aggiuntive sull'esito delle operazioni eseguite
- `query` (array) → riporta le query eseguite
- `result` (array) → riporta i risultati delle query

In determinate query o in caso di errore, gli attributi `query` e `result` possono assumere il valore di null.
