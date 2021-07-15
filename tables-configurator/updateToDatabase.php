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

  $response = new stdClass();



	$sql = "SHOW TABLES LIKE '" . $table ."'";

    $statement = $pdo->prepare($sql);

    $statement->execute();

    $tables = $statement->fetchAll(PDO::FETCH_NUM);



    if(!is_null($tables[0]) && $tables[0] != false){

        try {

        $timestamp = date("Y-m-d H:i:s");

        $_POST["projectJson"]  = stripslashes($_POST["projectJson"]);



        $data = [

        'projectURL'            => $_POST["projectURL"],    

        'thumbnailPath'         => $_POST["thumbnail_path"],

        'JSON'                  => $_POST["projectJson"],

        'plate'                 => $_POST["plate"],

        'legs'                  => $_POST["legs"],

        'name'                  => $_POST["projectName"]

        ];



        $genericData = [           

            'name'                  => $_POST["tableName"] . "@" . $_POST["projectName"],

            'projectURL'            => "https://www.industriedesign-loft.de/table-configurator/#/projects/". $_POST["tableName"] . "@" . $_POST["projectName"],   

            'thumbnailPath'         => $_POST["thumbnail_path"],

            'JSON'                  => $_POST["projectJson"],

            'plate'                 => $_POST["plate"],

            'legs'                  => $_POST["legs"],

            ];


        $updateGenericSql = $pdo->prepare("UPDATE `GenericProjects` SET projectURL= :projectURL,
                                                                        thumbnailPath= :thumbnailPath,
                                                                        JSON= :JSON,
                                                                        plate= :plate,
                                                                        legs= :legs
                                                                        WHERE name= :name");
        $updateGenericSql->execute($genericData);   
        
   


        $updateTableSql = $pdo->prepare("UPDATE $table SET  projectURL= :projectURL,
                                                            thumbnailPath= :thumbnailPath,
                                                            JSON= :JSON,
                                                            plate= :plate,
                                                            legs= :legs
                                                            WHERE name= :name");
        $updateTableSql->execute($data);                                                                                                                 


        $response->success = TRUE;

        $response->message = "Die Konfiguration wurde erfolgreich für Sie aktualisiert";

        echo(json_encode($response));

        } catch(PDOException $e) {

            $response->success = FALSE;

            $response->message = "Error: " . $e->getMessage();

            echo(json_encode($response));

        }

    } else{

            try {

                $query = $pdo->prepare("CREATE table $table(

                            `UID` TIMESTAMP, 

                            `name` TEXT(255) NOT NULL,

                            `projectURL` TEXT(255) NOT NULL,

                            `thumbnailPath` TEXT(9999) NOT NULL,

                            `JSON` TEXT(9999) NOT NULL,

                            `plate` TEXT(9999) NOT NULL,

                            `legs` TEXT(9999) NOT NULL,

                            PRIMARY KEY(`UID`)

                            )");

                $query->execute();



                $timestamp = date("Y-m-d H:i:s");

                $_POST["projectJson"]  = stripslashes($_POST["projectJson"]);



                $data = [             

                'UID'                   => $timestamp,

                'name'                  => $_POST["projectName"],

                'projectURL'            => $_POST["projectURL"],

                'thumbnailPath'         => $_POST["thumbnail_path"],

                'JSON'                  => $_POST["projectJson"],

                'plate'                 => $_POST["plate"],

                'legs'                  => $_POST["legs"],

                ];



                $insertSql = "INSERT INTO $table (UID, name, projectURL, thumbnailPath, JSON, plate, legs) VALUES (:UID, :name, :projectURL, :thumbnailPath, :JSON, :plate, :legs)";

                $stmt= $pdo->prepare($insertSql);

                $stmt->execute($data);



                $response->success = TRUE;

                $response->message = "Erfolgreich geupdated!";

                echo(json_encode($response));



            } catch(PDOException $e) {

                $response->success = FALSE;

                $response->message = "Error: " . $e->getMessage();

                echo(json_encode($response));

            }

    }

?> 

