<?php

   

    $name = $_POST["name"];

    $emailAddr = $_POST["email"];

    $contactEmail = $_POST["contactEmail"];

    $phone = $_POST["phone"];

    $message = $_POST["message"];

    $legsT = $_POST["legsType"];

    $plateT = $_POST["plateType"];

    $JSON = $_POST["projectJSON"];

    $thumbURL = $_POST["thumbUrl"];

    $projectUrl = $_POST["projectUrl"];

    $price = $_POST["price"];



    sendMailToOwner($name, $emailAddr, $contactEmail, $phone, $message, $legsT, $plateT, $JSON, $thumbURL, $price);

    sendMailToCustomer($contactEmail, $projectUrl);

?>



<?php

    function sendMailToOwner($userName, $emailAddress, $contactEmail, $userPhone, $userMessage, $legsType, $plateType, $J, $thumb, $pr){

        $to = "rh@industriedesign-loft.de";

	$from = $emailAddress;

        $subject = "New order from: " . $from;

        $mailMessage = '<html><body>';

        $mailMessage.= '<h3>The account ' .$from. ' placed a new order of ' .$pr. ' €</h3><br>';

        $mailMessage.= '<h4><u>User details:</u></h4><br>';

        $mailMessage.= 'Name: ' . $userName .'<br>';

        $mailMessage.= 'Email: ' . $contactEmail .'<br>';

        $mailMessage.= 'Phone: ' . $userPhone .'<br>';

        $mailMessage.= 'Message: ' . $userMessage .'<br>';

        $mailMessage.= '<h4><u>Project details:</u></h4>';

        $mailMessage.= '<strong>Legs type: </strong>' . $legsType . '<br>';

        $mailMessage.= '<strong>Plate type: </strong>' . $plateType . '<br><br>';

        $mailMessage.= '</body></html>';

        $mailMessage.= '<h4>Project Description (in JSON format):</h4>';

        $mailMessage.= '<textarea style="width: 100% ;height: 450px;position: relative;">' .stripslashes($J). '</textarea><br>';

        $mailMessage.= '<h4>Project Preview:</h4>';

        $mailMessage.= '<img src="' .$thumb. '"><hr>';

        $mailMessage.= '<p style="width: 100%; text-align: left">This email was generated automatically from the web app</p>';



        $headers = "From: " . strip_tags($from) . "\r\n";

        $headers .= "CC:".$from."\r\n";

        $headers .= "MIME-Version: 1.0\r\n";

        $headers .= "Content-Type: text/html; charset=utf-8\r\n";

        if(mail($to,$subject,$mailMessage,$headers)) {   

            $response = new stdClass();

            $response->success = TRUE;

            $response->message = "Vielen Dank. Ihre Anfrage wurde erfolgreich an uns gesendet. Wir melden uns umgehend bei Ihnen.";

            echo(json_encode($response));   

       }

    }



?>

<?php

    function sendMailToCustomer($customerEmail, $projectUrl){

        $toCustomer = $customerEmail;

        $fromOwner = "rh@industriedesign-loft.de";

        $subjectToCustomer = "Direct access for your project";

        $mailMessageToCustomer = '<html><body>';

        $mailMessageToCustomer .= '<h4>You can directly access your project here: </h4> <a href="' . $projectUrl . '">' . $projectUrl . '</a>' ;

        $mailMessageToCustomer .= '<p style="width: 100% ; text-align: left">This email was generated automatically from the web app</p>';

        $mailMessageToCustomer .= '</body></html>';



        $headersForCustomer = "From: " . strip_tags($fromOwner) . "\r\n";

        $headersForCustomer .= "CC:".$fromOwner."\r\n";

        $headersForCustomer .= "MIME-Version: 1.0\r\n";

        $headersForCustomer .= "Content-Type: text/html; charset=utf-8\r\n";

        mail($toCustomer,$subjectToCustomer,$mailMessageToCustomer,$headersForCustomer);

    }

?>