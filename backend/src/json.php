<?php

function validate($json) {
    // controllo che sia presente un json
    if (!empty($json)) {
        // controllo che il json sia valido
        if (json_validate($json)) {
            // convertire il json in un oggetto
            $data = json_decode($json);
            return $data;
        } else {
            throw new Exception("JSON is invalid");
        }
    } else {
        throw new Exception("JSON is empty");
    }
}
