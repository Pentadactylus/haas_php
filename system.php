<?php

require_once( "controller.php" );

$output = Controller::remoteSSH( $_POST['command'], $_POST['ip'] );

if( $output=="" ) {
    echo "N/A";
}
else {
    echo $output;
}

?>