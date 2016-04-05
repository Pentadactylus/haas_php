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

require_once( "SOController.php" );
require_once( "SMController.php" );
require_once( "vendor/autoload.php" );

$inputString = file_get_contents('php://input');

$input = Zend\Json\Json::decode( $inputString, Zend\Json\Json::TYPE_ARRAY );

//
//$action = $_POST['action'];
//$KID = $_POST['token'];
//$TENANT = $_POST['tenant'];
//$URL = $_POST['url'];
//$OTERM = $_POST['oterm'];

$controller = SMController;


switch( $input['action'] ) {
    case 'servicetype':
        $output = $controller::getServiceType( $KID, $TENANT, $URL );
        break;
    case 'createinstance':

        $output = "";

        $parameters = Array();
        foreach( $input as $key => $value ) {
            if( preg_match( '/^icclab\.haas\./', $key ) ) {
                $parameters[ $key ] = $value;
                $output = $output."\n".$key."=".$value;
            }
        }
        echo "parameters:";
        var_dump($input);

        // TODO: input has to be checked
        $output = $controller::createInstance( $parameters, $input['token'], $input['tenant'], $input['oterm'] );
        break;
    case 'getservices':
        var_dump($input);
        $output = $controller::getServices( $KID, $TENANT, $OTERM, $URL );
        break;
    case 'getimages':
        $output = $controller::getOSImages();
        break;
    case 'getfloatingips':
        $output = $controller::getFloatingIPs();
        break;
    case 'getvolumes':
        $output = $controller::getVolumes();
        break;
    case 'getsshpublickeys':
        $output = $controller::getRegisteredSSHKeys();
        break;
    case 'getflavors':
        $output = $controller::getFlavors();
        break;
    case 'gettoken':
        $output = $controller::getToken();
        break;
    case 'getclusterstate':
        $output = $controller::getClusterState($KID);
        break;
    case 'deletecluster':
        // TODO: input has to be checked
        $output = $controller::deleteCluster($input['ip'],$input['token']);
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

