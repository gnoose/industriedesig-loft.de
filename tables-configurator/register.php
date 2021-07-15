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
                    sendRegisterEmail($username);
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

    function sendRegisterEmail($customerEmail){

        $toCustomer = $customerEmail;

        $fromOwner = "rh@industriedesign-loft.de";

        $subjectToCustomer = "Passwort wurde zurückgesetzt";

        $mailMessageToCustomer = '<html><body>';

        $mailMessageToCustomer .= '<h4>Vielen Dank für die Registrierung im Tisch Konfigurator.</h4>';

        $mailMessageToCustomer .= '<p>Sie können sich jederzeit mit Ihrer E-Mailadresse und dem von Ihnen vergebenen Passwort Einloggen und Ihre ganz persönlichen Tisch Designs entwerfen und abspeichern.</p>';

        $mailMessageToCustomer .= '<p>Sobald Sie ein Design gespeichert haben, können Sie bei uns ein Angebot dafür anfordern.</p>';

        $mailMessageToCustomer .= '<p>Dazu klicken Sie im Tisch Konfigurator unten rechts auf die Schaltfläche [Angebot anfordern] Unsere Kollegen senden Ihnen so schnell wie möglich eine Antwort. </p>';

        $mailMessageToCustomer .= '<p>Wenn Sie für Ihren Tisch noch Ansteckplatten zur Tischverbreiterung oder sonstige Individualisierungen wünschen ist das überhaupt kein Problem. Diese können auch nachträglich telefonisch geordert werden. Sprechen Sie mit uns.</p>';

        $mailMessageToCustomer .= '<p>Und nun, viel Spaß beim Erstellen Ihres Designertisches.</p>';

        $mailMessageToCustomer .= '<p>Viele Grüße sendet Ihnen</p>';

        $mailMessageToCustomer .= '<p>Ihr Team von:</p>';

        $mailMessageToCustomer .= '<p>Rudolf Helminger Interior-Manufaktur</p>';

        $mailMessageToCustomer .= '<p>Schloßstraße 21</p>';

        $mailMessageToCustomer .= '<p>83620 Feldkirchen-Westerham</p>';

        $mailMessageToCustomer .= '<br>';

        $mailMessageToCustomer .= '<p>Tel: +49 (0) 151 22 00 3618</p>';

        $mailMessageToCustomer .= '<p><a href="mailto:rh@industriedesign-loft.de">E-mail: rh@industriedesign-loft.de</a></p>';

        $mailMessageToCustomer .= '<p><a href="https://www.industriedesign-loft.de/">www.industriedesign-loft.de</a></p>';

        $mailMessageToCustomer .= '</body></html>';



        $headersForCustomer = "From: " . strip_tags($fromOwner) . "\r\n";

        $headersForCustomer .= "CC:".$fromOwner."\r\n";

        $headersForCustomer .= "MIME-Version: 1.0\r\n";

        $headersForCustomer .= "Content-Type: text/html; charset=utf-8\r\n";

        mail($toCustomer,$subjectToCustomer,$mailMessageToCustomer,$headersForCustomer);

    }
?> 