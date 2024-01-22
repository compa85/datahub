<?php
/*
// =================================================================================================
DATABASE.PHP

Questo file contiene alcune funzioni che permettono di effettuare le principali operazioni per la gestione di un database (insert, update, delete).
La maggior parte delle seguenti funzioni richiedono come parametro un oggetto, le cui proprietà corrispondono al nome, ai campi e ai valori delle tabelle del database.

Per semplificare la creazione di questi oggetti, si consiglia di effettuare una conversione di file JSON, nel seguente modo:

$json = file_get_contents("example.json");
$object = json_decode($json);


Il seguente è un esempio del contenuto del file JSON:

{
    "customers": [
        {
            "name": "Mario",
            "surname": "Rossi",
            "email": "mario@example.com"
        },
        {
            "name": "Giovanni",
            "surname": "Verdi",
            "email": "giovanni@example.com"
        }
    ]
}

"cusotmers" è il nome della tabella, mentre "name", "surname" e "email" sono i suoi campi.

// =================================================================================================
*/

class Database {
    // ========================================= VARIABILI =========================================

    public $conn;


    // ======================================== COSTRUTTORE ========================================

    public function __construct($host, $username, $password, $database) {
        try {
            $this->conn = new mysqli($host, $username, $password, $database);
        } catch (Exception $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }


    // ======================================== INSERIMENTO ========================================
    // Assicurati che gli oggetti presenti all'interno dello stesso vettore abbiano gli stessi campi

    public function insert($object) {
        // messaggio di risposta
        $message = "";

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $name => $table) {
            $query = "INSERT INTO $name ";
            $fields  = null;
            $values = array();

            // scorro il vettore $table che rappresenta la tabella del db
            foreach ($table as $record) {

                if ($fields == null) {
                    // assegno a $fields un array che contiene i nomi dei campi
                    $fields = array_keys(get_object_vars($record));
                    // accodo alla query i nomi dei campi
                    $query .= "(" . implode(", ", $fields) . ") VALUES ";
                } else {
                    // confronto gli array contenenti i nomi dei campi
                    $diff = array_diff($fields, array_keys(get_object_vars($record)));
                    // se i campi sono diversi genera un errore
                    if (!empty($diff)) {
                        $message = "Error: Different fields in the objects";
                        return $message;
                    }
                }

                // aggiungo la stringa dei valori nell'array $values
                $string = "('" . implode("', '", array_values(get_object_vars($record))) . "')";
                array_push($values, $string);
            }

            // accodo alla query le stringhe dei valori presenti in $values
            $query .= implode(", ", $values);

            // eseguo la query
            try {
                $this->conn->query($query);
                // ottengo il numero di righe inserite
                $inserted = $this->conn->affected_rows;
                $message = "$inserted records inserted";
            } catch (Exception $e) {
                $message = "Error: " . $e->getMessage();
                return $message;
            }
        }

        return $message;
    }


    // ========================================= RIMOZIONE =========================================

    public function delete($object) {
        // messaggio di risposta
        $message = "";

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $name => $table) {
            if (!empty($table)) {
                // scorro il vettore $table che rappresenta la tabella del db
                foreach ($table as $record) {
                    $query = "DELETE FROM $name WHERE ";

                    // assegno a $fields un array associativo che contiene i nomi e i valori dei campi
                    $fields = get_object_vars($record);
                    $conditions = array();

                    // scorro il vettore $table che rappresenta la tabella del db
                    foreach ($fields as $field => $value) {
                        // controllo che non ci siano spazi nei campi e nei valori
                        if (str_contains($field, " ") || str_contains($value, " ")) {
                            $message = "Error: '$field: $value' contains a space character";
                            return $message;
                        }

                        // aggiungo la stringa delle condizioni nell'array $conditions
                        $string = "$field = '$value'";
                        array_push($conditions, $string);
                    }

                    // accodo alla query le stringhe delle condizioni
                    $query .= implode(" AND ", $conditions);

                    // eseguo la query
                    try {
                        $this->conn->query($query);
                        // ottengo il numero di righe cancellate
                        $deleted = $this->conn->affected_rows;
                        $message = "$deleted records deleted";
                    } catch (Exception $e) {
                        $message = "Error: " . $e->getMessage();
                        return $message;
                    }
                }
            } else {
                // elimino tutti i campi della tabella
                $query = "DELETE FROM $name";

                // eseguo la query
                try {
                    $this->conn->query($query);
                    $message = "All records of '$name' deleted";
                } catch (Exception $e) {
                    $message = "Error: " . $e->getMessage();
                    return $message;
                }
            }
        }

        return $message;
    }
}
