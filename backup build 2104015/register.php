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

    $username = $_POST['email'];   
    
    if (!filter_var($username, FILTER_VALIDATE_EMAIL)) {
        $res = new stdClass();
        $res->type = "error";
        $res->message = "ungültiges E-Mailformat ";
        echo(json_encode($res));
    }else if(strlen(trim($_POST['password'])) < 6){
        $res = new stdClass();
        $res->type = "error";
        $res->message = "Das Passwort sollte mindestens aus 6 Zeichen bestehen";
        echo(json_encode($res));
    }    
    else{
    $pasword = hash('sha256', $_POST['password']);  
    $stmt = $pdo->prepare('SELECT * FROM Users WHERE email = :username');
				$stmt->execute(array(
					':username' => $username
					));
				$data = $stmt->fetch(PDO::FETCH_ASSOC);
			if($data == true){
                    		$res = new stdClass();
                    		$res->type = "error";
                    		$res->message = "Emailadresse bereits registriert";
                    		echo(json_encode($res));
                    		exit; 
			}else{ 
                    try {
                        $stmt = $pdo->prepare('INSERT INTO Users (email, password) VALUES (:username, :pas)');
                        $stmt->execute(array(
                            ':username' => $username,
                            ':pas' => $pasword
                            ));
                            $res = new stdClass();
                            $res->type = "success";
                            $res->message = "Zugang für $username wurde erstellt.";
                            echo(json_encode($res));
                        exit;

                        }
                    catch(PDOException $e) {
                            $res = new stdClass();
                            $res->type = "error";
                            $res->message = $e->getMessage();
                            echo(json_encode($res));
			    exit;
          } 
       }
    }
?> 