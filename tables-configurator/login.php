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

	$response = new stdClass();
	$username = $_POST['email'];
	$password = hash('sha256', $_POST['password']);
	
	try {
				$stmt = $pdo->prepare('SELECT * FROM Users WHERE email = :username');
				$stmt->execute(array(
					':username' => $username
					));
				$data = $stmt->fetch(PDO::FETCH_ASSOC);
				if($data == false){
					$response->success = FALSE;
                    $response->message = "Benutzer $username nicht gefunden.";
                    echo(json_encode($response));
				}
				else {
					if($password == $data['password']) {
						session_start(); 
						$_SESSION['message'] = "Erfolgreich eingeloggt";
						$_SESSION['email'] = $data['email'];
						$_SESSION['logged'] = TRUE;
						$_SESSION['session_id'] = session_id();
						echo(json_encode($_SESSION));
						exit;
					}
					else
						 $_SESSION['message'] = "Benutzername oder Passwort falsch";
        					 $_SESSION['email'] = $data['email']; 
        					 $_SESSION['logged'] = FALSE;
 						 echo(json_encode($_SESSION));
						 exit;
				}
			}
			catch(PDOException $e) {
				$_SESSION['message'] = $e->getMessage();
				$_SESSION['email'] = $data['email']; 
				$_SESSION['logged'] = FALSE;
				echo(json_encode($_SESSION));
				exit;
			}
?> 