<?php 

include "config.php";

if(isset($_POST['search'])){
    $search = mysqli_real_escape_string($con,$_POST['search']);

    $query = "SELECT * FROM users WHERE name like'%".$search."%'";
    $result = mysqli_query($con,$query);
    
    while($row = mysqli_fetch_array($result) ){
        $response[] = array("value"=>$row['id'],"label"=>$row['name']);
    }

    echo json_encode($response);
}

exit;


