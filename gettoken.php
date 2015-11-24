<?php

/*
 * NOTE: password has to be inserted into OpenStack env. file!
 */

require_once( "controller.php" );

echo Controller::getToken();

?>