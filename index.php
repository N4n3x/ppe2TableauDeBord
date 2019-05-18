<?php

    if(!isset($_GET['action']))
       $_GET['action']="defaut";
    
    switch($_GET['action']) {
        case "defaut":
            include("vues/page.html");
        break;
    }
?>