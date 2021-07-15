<?php 

header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

header('Access-Control-Allow-Methods: GET');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');



session_start(); 


if(!isset($_SESSION['logged']) || !$_SESSION['logged']){ 

    $res = new stdClass();

    $res->logged = FALSE;

    $res->email = "";
    //TODO: for the test
    //$res->logged = TRUE;
    //$res->email = "jieli3838@gmail.com";
    // $res->session_id = session_id();
    echo(json_encode($res)); 

    exit; 

} 

$res = new stdClass();

$res->logged = TRUE;

$res->email = $_SESSION["email"];

echo(json_encode($res)); 

?> 