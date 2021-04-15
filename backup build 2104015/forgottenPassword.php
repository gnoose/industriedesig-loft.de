<?php 

//header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

//header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');

//header('Access-Control-Max-Age: 1000');

//header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');





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

    $newPassword = hash('sha256', $_POST['password']);

	

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

                $updatePassword = $pdo->prepare('UPDATE Users SET password= :newPassword WHERE email= :username');



                if($updatePassword->execute(array(':username' => $username,':newPassword' => $newPassword))){

                    sendPassword($_POST['email'], $_POST['password']);

                    $response->success = TRUE;

                    $response->message = "Das Passwort wurde aktualisiert und an Ihre E-Mail gesendet";

                    echo(json_encode($response));

                }else{

                    $response->success = FALSE;

                    $response->message = "Fehler beim Aktualisieren des Passworts";

                    echo(json_encode($response));

                }

            }

        }

    catch(PDOException $e) {

            $response->success = FALSE;

            $response->message = "Error: " . $e->getMessage();

            echo(json_encode($response));

        }

?> 



<?php

    function sendPassword($customerEmail, $pass){

        $toCustomer = $customerEmail;

        $fromOwner = "rh@industriedesign-loft.de";

        $subjectToCustomer = "Passwort wurde zurückgesetzt";

        $mailMessageToCustomer = '<html><body>';

        $mailMessageToCustomer .= '<h4>Ihr Passwort wurde zurückgesetzt</h4>';

        $mailMessageToCustomer .= 'Bitte benutzen Sie dieses Passwort, um sich in Ihrem Konto anzumelden: <strong>' . $pass . '</strong>';

        $mailMessageToCustomer .= '<br><br><p style="width: 100% ;text-align:left">Diese E-Mail wurde automatisch vom Server erstellt:' . $_SERVER['SERVER_NAME'] . '</p>';

        $mailMessageToCustomer .= '</body></html>';



        $headersForCustomer = "From: " . strip_tags($fromOwner) . "\r\n";

        $headersForCustomer .= "CC:".$fromOwner."\r\n";

        $headersForCustomer .= "MIME-Version: 1.0\r\n";

        $headersForCustomer .= "Content-Type: text/html; charset=utf-8\r\n";

        mail($toCustomer,$subjectToCustomer,$mailMessageToCustomer,$headersForCustomer);

    }

?>