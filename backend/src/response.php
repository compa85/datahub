<?php

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
