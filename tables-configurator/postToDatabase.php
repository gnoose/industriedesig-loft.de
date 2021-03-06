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
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE name = :name");
            $stmt->execute(array(
                ':name' => $_POST["projectName"]
            ));
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if($data !== false){
                $response->success = FALSE;
                $response->message = "Fehler: Duplizierter Projektname";
                echo(json_encode($response));
            } else {  
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

                $genericData = [     
                    'UID'                   => $timestamp,
                    'name'                  => $_POST["tableName"] . "@" . $_POST["projectName"],
                    'projectURL'            => "https://www.industriedesign-loft.de/table-configurator/#/projects/". $_POST["tableName"] . "@" . $_POST["projectName"],   
                    'thumbnailPath'         => $_POST["thumbnail_path"],
                    'JSON'                  => $_POST["projectJson"],
                    'plate'                 => $_POST["plate"],
                    'legs'                  => $_POST["legs"],
                    ];
                

                $genericInsertSql = "INSERT INTO `GenericProjects` (UID, name, projectURL, thumbnailPath, JSON, plate, legs) VALUES (:UID, :name, :projectURL, :thumbnailPath, :JSON, :plate, :legs)";
                $genericStmt= $pdo->prepare($genericInsertSql);
                $genericStmt->execute($genericData);

                $insertSql = "INSERT INTO $table (UID, name, projectURL, thumbnailPath, JSON, plate, legs) VALUES (:UID, :name, :projectURL, :thumbnailPath, :JSON, :plate, :legs)";
                $stmt= $pdo->prepare($insertSql);
                $stmt->execute($data);

                $response->success = TRUE;
                $response->message = "Konfiguration wurde erfolgreich f??r sie gespeichert";
                echo(json_encode($response));
            }
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

                $response->message = "Erfolgreich  gespeichert!";

                echo(json_encode($response));



            } catch(PDOException $e) {

                $response->success = FALSE;

                $response->message = "Error: " . $e->getMessage();

                echo(json_encode($response));

            }

    }

?> 

