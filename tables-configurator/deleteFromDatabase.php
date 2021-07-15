<?php 

    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


    $dbHost = "mysql5.weboffice.de"; 
    $dbUser = "db47723_99";           
    $dbPass = "2ajd1hjWjpzR";           
    $dbDatabase = "db47723_99";    
    
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbDatabase", $dbUser, $dbPass);
    if (!$pdo) {
        printf("Failed to connect to database");
        exit();
    }

    $table = $_POST["tableName"];
    $projectName = $_POST["projectName"];
    $response = new stdClass();

    $count=$pdo->prepare("DELETE FROM " . $table. " WHERE name=:name");
    $count->bindParam(":name",$projectName);

  if($count->execute()){
    $response->success = TRUE;
    $response->message = "This project has been deleted";
    echo(json_encode($response));
  }else{
    $response->success = FALSE;
    $response->message = "Error: " . $e->getMessage();
    echo(json_encode($response));
  }

  ?>