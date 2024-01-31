<?php

// =========================================== DATABASE ============================================
class Database {
    // ========================================= VARIABILI =========================================

    public $conn;
    public $error;


    // ======================================== COSTRUTTORE ========================================

    public function __construct($host, $username, $password, $database, $port) {
        try {
            $this->conn = @new mysqli($host, $username, $password, $database, $port);
        } catch (Exception $e) {
            $this->error = $e->getMessage();
        }
    }


    // ======================================== INSERIMENTO ========================================

    public function insert($object) {
        // array delle query da eseguire (le query vengono eseguite solo alla fine, se non sono stati rilevati errori durante l'esecuzione)
        $queries = array();

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $table_name => $table) {
            // controllo che la tabella non sia vuota
            if (!empty($table)) {
                $query = "INSERT INTO $table_name ";
                $fields = null;
                $values = array();

                // scorro il vettore $table che rappresenta la tabella del db
                foreach ($table as $record) {
                    // array che contiene i nomi dei campi
                    $local_fields = array();
                    // array che contiene i valori dei campi
                    $local_values = array();

                    // scorro il vettore $record che rappresenta la riga del db
                    foreach ($record as $field => $value) {
                        // controllo che non ci siano spazi nei campi, per evitare errori durante l'esecuzione della query
                        if (str_contains($field, " ")) {
                            return new Response(false, "'$field: $value' contains a space character");
                        }

                        // aggiungo i nomi e i valori dei campi nei rispettivi array
                        array_push($local_fields, $field);
                        array_push($local_values, $value);
                    }

                    if ($fields == null) {
                        $fields = $local_fields;
                        // accodo alla query i nomi dei campi
                        $query .= "(" . implode(", ", $local_fields) . ") VALUES ";
                    } else {
                        // confronto gli array contenenti i nomi dei campi
                        $diff = array_diff($fields, $local_fields);
                        // controllo se i campi sono diversi o se non sono lo stesso numero
                        if (!empty($diff) || count($fields) != count($local_fields)) {
                            return new Response(false, "Different fields in '$table_name'");
                        }
                    }

                    // aggiungo la stringa dei valori all'array $values
                    $string = "('" . implode("', '", $local_values) . "')";
                    array_push($values, $string);
                }

                // accodo alla query le stringhe dei valori presenti in $values, separandoli con una virgola
                $query .= implode(", ", $values);
                // aggiungo la query all'array $queries
                array_push($queries, $query);
            } else {
                return new Response(false, "Table '$table_name' is empty");
            }
        }

        // variabile per il conteggio dei record inseriti
        $inserted = 0;
        // variabile per salvare gli id dei record inseriti
        $id = array();

        // eseguo tutte le query se non si sono verificati errori
        foreach ($queries as $query) {
            try {
                $this->conn->query($query);
                // salvo il numero di righe inserite con la query
                $affected_rows = $this->conn->affected_rows;
                // salvo l'id del primo record della query
                $start_id = $this->conn->insert_id;
                // incremento il numero di righe inserite
                $inserted += $affected_rows;
                // salvo ogni id inserito partendo dal primo record della query
                for ($i = $start_id; $i < $start_id + $affected_rows; $i++) {
                    array_push($id, $i);
                }
            } catch (Exception $e) {
                return new Response(false, $e->getMessage());
            }
        }

        return new Response(true, "$inserted records inserted", $queries, $id);
    }


    // ========================================= RIMOZIONE =========================================

    public function delete($object) {
        // array delle query da eseguire (le query vengono eseguite solo alla fine, se non sono stati rilevati errori durante l'esecuzione)
        $queries = array();

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $table_name => $table) {
            // controllo che la tabella non sia vuota
            if (!empty($table)) {
                // scorro il vettore $table che rappresenta la tabella del db
                foreach ($table as $record) {
                    $query = "DELETE FROM $table_name WHERE ";
                    $conditions = array();

                    // scorro il vettore $record che rappresenta la riga del db
                    foreach ($record as $field => $value) {
                        // controllo che non ci siano spazi nei campi, per evitare errori durante l'esecuzione della query
                        if (str_contains($field, " ")) {
                            return new Response(false, "'$field: $value' contains a space character");
                        }

                        // aggiungo la stringa delle condizioni nell'array $conditions
                        $string = "$field = '$value'";
                        array_push($conditions, $string);
                    }

                    // accodo alla query le condizioni, separandole con AND
                    $query .= implode(" AND ", $conditions);
                    // aggiungo la query all'array $queries
                    array_push($queries, $query);
                }
            } else {
                // elimino tutti i campi della tabella
                $query = "DELETE FROM $table_name";
                array_push($queries, $query);
            }
        }

        // variabile per il conteggio dei record eliminati
        $deleted = 0;

        // eseguo tutte le query se non si sono verificati errori
        foreach ($queries as $query) {
            try {
                $this->conn->query($query);
                // ottengo il numero di righe cancellate
                $deleted += $this->conn->affected_rows;
            } catch (Exception $e) {
                return new Response(false, $e->getMessage());
            }
        }

        return new Response(true, "$deleted records deleted", $queries);
    }


    // ======================================= AGGIORNAMENTO =======================================

    public function update($object) {
        // array delle query da eseguire (le query vengono eseguite solo alla fine, se non sono stati rilevati errori durante l'esecuzione)
        $queries = array();

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $table_name => $table) {
            // scorro il vettore $table che rappresenta la tabella del db
            foreach ($table as $record) {
                $query = "UPDATE $table_name SET ";

                // controllo che $record contenga solo due oggetti: il primo il record da modificare e il secondo le modifiche
                if (gettype($record) == "array" && count($record) == 2) {
                    // assegno a $old e $new array associativi che contengono i nomi e i valori dei campi vecchi e nuovi
                    $old = get_object_vars($record[0]);
                    $new = get_object_vars($record[1]);
                    $conditions = array();

                    // scorro il vettore $new
                    foreach ($new as $field => $value) {
                        // controllo che non ci siano spazi nei campi, per evitare errori durante l'esecuzione della query
                        if (str_contains($field, " ")) {
                            return new Response(false, "'$field: $value' contains a space character");
                        }

                        // aggiungo la stringa delle condizioni all'array $conditions
                        $string = "$field = '$value'";
                        array_push($conditions, $string);
                    }

                    // accodo alla query le stringhe dei dati da aggiornare e ricreo array condizioni per cancellare dati inseriti precedentemente
                    $query .= implode(", ", $conditions);
                    $query .= " WHERE ";
                    $conditions = array();

                    // scorro il vettore $old
                    foreach ($old as $field => $value) {
                        // controllo che non ci siano spazi nei campi, per evitare errori durante l'esecuzione della query
                        if (str_contains($field, " ")) {
                            return new Response(false, "'$field: $value' contains a space character");
                        }

                        // aggiungo la stringa delle condizioni all'array $conditions
                        $string = "$field = '$value'";
                        array_push($conditions, $string);
                    }

                    // accodo alla query le condizioni, separandole con AND
                    $query .= implode(" AND ", $conditions);
                    // aggiungo la query all'array $queries
                    array_push($queries, $query);
                } else {
                    return new Response(false, "Table '$table_name' doesn't contain arrays with 2 objects");
                }
            }
        }

        // variabile per il conteggio dei record aggiornati
        $updated = 0;

        // eseguo tutte le query se non si sono verificati errori
        foreach ($queries as $query) {
            try {
                $this->conn->query($query);
                // ottengo il numero di righe aggiornate
                $updated += $this->conn->affected_rows;
            } catch (Exception $e) {
                return new Response(false, $e->getMessage());
            }
        }

        return new Response(true, "$updated records updated", $queries);
    }


    // ========================================= SELEZIONE =========================================

    public function select($object) {
        // array delle query da eseguire (le query vengono eseguite solo alla fine, se non sono stati rilevati errori durante l'esecuzione)
        $queries = array();

        // scorro l'oggetto $object che contiente le tabelle del db
        foreach ($object as $table_name => $table) {
            // controllo che la tabella non sia vuota
            if (!empty($table)) {
                $query = "SELECT * FROM $table_name WHERE ";
                // array che contiene le condizioni separate da AND ($single_conditions)
                $conditions = array();

                // scorro il vettore $table che rappresenta la tabella del db
                foreach ($table as $record) {
                    // assegno a $fields un array associativo che contiene i nomi e i valori dei campi
                    $fields = get_object_vars($record);
                    $single_conditions = array();

                    // scorro il vettore $fields che rappresenta la riga del db
                    foreach ($fields as $field => $value) {
                        // controllo che non ci siano spazi nei campi
                        if (str_contains($field, " ")) {
                            return new Response(false, "'$field: $value' contains a space character");
                        }

                        // aggiungo la stringa delle condizioni all'array $conditions
                        $string = "$field = '$value'";
                        array_push($single_conditions, $string);
                    }

                    // accodo alla query le condizioni
                    $string = "(" . implode(" AND ", $single_conditions) . ")";
                    array_push($conditions, $string);
                }

                // aggiungo la stringa delle condizioni separate da OR all'array $conditions
                $query .= implode(" OR ", $conditions);
                // aggiungo la query all'array $queries
                array_push($queries, $query);
            } else {
                // seleziono tutti i campi della tabella
                $query = "SELECT * FROM $table_name";
                // aggiungo la query all'array $queries
                array_push($queries, $query);
            }
        }

        // variabile per il conteggio delle righe restituite
        $selected = 0;
        // array che contiene i risultati delle query
        $results = array();

        // eseguo tutte le query se non si sono verificati errori
        foreach ($queries as $query) {
            try {
                // salvo in result il risultato della query
                $result = $this->conn->query($query);
                // ottengo il numero di righe restituite
                $selected += $result->num_rows;

                // controllo che il risutato abbia più di 0 righe
                if ($selected > 0) {
                    // aggiungo all'array $results il risultato della query come array associativo
                    array_push($results, $result->fetch_all(MYSQLI_ASSOC));
                }
            } catch (Exception $e) {
                return new Response(false, $e->getMessage());
            }
        }

        return new Response(true, "$selected records selected", $queries, $results);
    }
}


// =========================================== RISPOSTA ============================================
class Response {
    // ========================================= VARIABILI =========================================

    public $status;
    public $message;
    public $query;
    public $result;


    // ======================================== COSTRUTTORI ========================================
    public function __construct($status, $message, $query = null, $result = null) {
        if ($status) {
            $this->status = "ok";
        } else {
            $this->status = "error";
        }
        $this->message = $message;
        $this->query = $query;
        $this->result = $result;
    }
}
