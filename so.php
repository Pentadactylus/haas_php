<?php

/*
 *
 * This is the proxy file which will forward the requests to the controller
 *
 *
 *
export URL="http://127.0.0.1:8888"
export OTERM="haas"
export KID=7381d8eb4a19407ca8b127042a670e60
export TENANT=mesz


# check for the service type
curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: '$KID -H 'X-Tenant-Name: '$TENANT $URL/-/

# create a service instance - will return instance URL in the Location header
curl -v -X POST $URL/$OTERM/ -H 'Category: '$OTERM'; scheme="http://schemas.cloudcomplab.ch/occi/sm#"; class="kind";' -H 'Content-type: text/occi' -H 'X-Auth-Token: '$KID -H 'X-Tenant-Name: '$TENANT

export ID=ID_FROM_LOCATION_HEADER

curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: '$KID -H 'X-Tenant-Name: '$TENANT $URL/$OTERM/$ID

# delete
curl -v -X DELETE -H 'Content-type: text/occi' -H 'X-Auth-Token: '$KID -H 'X-Tenant-Name: '$TENANT $URL/$OTERM/$ID
 */

require_once("php/Controller.php");
require_once( "vendor/autoload.php" );

$inputString = file_get_contents('php://input');

Controller::log("inputstring: ".$inputString);

Zend\Json\Json::$useBuiltinEncoderDecoder = true;
$input = Zend\Json\Json::decode( $inputString, Zend\Json\Json::TYPE_ARRAY );
Controller::log("inputtype:".gettype($input));
Controller::log($input);


$controller = Controller;

//$output = "";

$parameters = Array();
foreach( $input as $key => $value ) {
    if( preg_match( '/^\b(username|password|region|token|tenant|clusterurl|icclab\.haas\.)\b/', $key ) ) {
        $parameters[ $key ] = $value;
//        $output = $output."\n".$key."=".$value;
    }
}

switch( $input['action'] ) {
    case 'authenticate':
        $output = $controller::authenticate( $input );
        if( $output==false ) {
            $output = 'false';
        }
        else {
            $output = 'true';
        }
        break;
//    case 'servicetype1
    case 'createinstance':
        Controller::log("createinstance");


//        $output = "";
//
//        $parameters = Array();
//        foreach( $input as $key => $value ) {
//            if( preg_match( '/^\b(username|password|region|token|tenant|icclab\.haas\.)\b/', $key ) ) {
//                $parameters[ $key ] = $value;
//                $output = $output."\n".$key."=".$value;
//            }
//        }

//        echo "parameters:";
//        var_dump($input);

        // TODO: input has to be checked
        $output = $controller::createInstance( $parameters );
        break;
//    case 'getservices':
//        var_dump($input);
//        $output = $controller::getServices( $KID, $TENANT, $OTERM, $URL );
//        break;
    case 'getimages':
        $output = $controller::getOSImages( $parameters );
        break;
//    case 'getfloatingips':
//        $output = $controller::getFloatingIPs( $parameters );
//        break;
//    case 'getvolumes':
//        $output = $controller::getVolumes( $parameters );
//        break;
    case 'getsshpublickeys':
        $output = $controller::getRegisteredSSHKeys( $parameters );
        break;
    case 'getflavors':
        $output = $controller::getFlavors( $parameters );
        break;
    case 'getclusterstate':
        $output = $controller::getClusterState($KID);
        break;
    case 'deletecluster':
        // TODO: input has to be checked
        $output = $controller::deleteCluster($input['ip'],$input['token']);
        break;
    case 'getinstances':
        $output = $controller::getInstances( $parameters );
        break;
    case 'getclusterinfo':
        $output = $controller::getClusterInfo( $parameters );
        break;
    case 'sshcommand':
        echo $input['ip'];
        echo $input['command'];
        $output = Controller::remoteSSH( escapeshellcmd($input['command']), $input['ip'] );
        break;
    default:
        break;
}

if( $output=="" ) {
    echo "N/A";
}
else {
    echo $output;
}

?>
