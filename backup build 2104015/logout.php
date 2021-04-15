<?php
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

session_start();
session_unset();
session_destroy();
$result = new stdClass();
$result->success = TRUE;
$result->message = "Successful logout";
echo(json_encode($result));