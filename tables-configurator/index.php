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
	$tablename = $_GET['tablename'];
 	$response = new stdClass();

    	$query = $pdo->prepare("SELECT * FROM ".$tablename);
	if($query){
    	$query->execute();

    	$result = $query -> fetchAll();
    	echo json_encode($result);
	}else{
	 $response->success = FALSE;
      	 $response->message = "Table doesn't exist";
      	 echo(json_encode($response));	
	}

?> 