<?php

/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 06/01/16
 * Time: 11:35
 */

require_once("Controller.php");

class SOController extends Controller
{
    public static function createInstance( $params, $KID, $TENANT="", $OTERM="", $URL="" ) {
        $TENANT = self::checkContent( $TENANT, self::$tenant );
        $URL = self::checkContent( $URL, self::$url );
        $OTERM = self::checkContent( $OTERM, self::$oterm );
        $slavecount = self::checkContent( $params['slavecount'], 0);

//token = '32fcaece34204f44b26dccd45228804b'
//heads = {'X-Auth-Token':token, 'X-Tenant-Name':'mesz', 'Content-Type':'text/occi', 'Accept':'text/occi'}
//
//heads['Category']='orchestrator; scheme="http://schemas.mobile-cloud-networking.eu/occi/service#"'
// r = requests.put(host+'/orchestrator/default', headers=heads);
//
//heads['Category']='deploy; scheme="http://schemas.mobile-cloud-networking.eu/occi/service#"'
//heads['X-OCCI-Attribute']='icclab.haas.slave.number="1",icclab.haas.master.floatingip="false",icclab.haas.master.slaveonmaster="false",icclab.haas.master.sshkeyname="mesz MNMBA"'
// r = requests.post(host+'/orchestrator/default?action=deploy', headers=heads); r.headers;

        $command = "curl -v -X PUT {$URL}/orchestrator/default -H 'Content-type: text/occi' -H 'Accept: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' -H 'Category: orchestrator; scheme=\"http://schemas.mobile-cloud-networking.eu/occi/service#\"'";
        echo $command;
        $retval = self::obSystem($command);
        $command = "curl -v -X POST {$URL}/orchestrator/default?action=deploy -H 'Content-type: text/occi' -H 'Accept: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' -H 'Category: deploy; scheme=\"http://schemas.mobile-cloud-networking.eu/occi/service#\"' -H 'X-OCCI-Attribute: icclab.haas.slave.number=1,icclab.haas.master.floatingip=\"false\",icclab.haas.master.slaveonmaster=\"false\",icclab.haas.master.sshkeyname=\"mesz MNMBA\"'";
        echo $command;
        $retval = self::obSystem($command);
        return $retval;
    }

    public static function deleteCluster($ip, $KID, $TENANT="") {
        $TENANT = self::checkContent( $TENANT, self::$tenant );

        //| 034f34b7-5ff5-4109-9e8b-a9d919e7ff39 | 192.168.19.2     | 160.85.4.134        | 562e1c2b-7cdd-4309-bea7-6ec40d16cda3 |
        $command = "neutron floatingip-list | grep ".$ip;
        $keypairOutput = self::openStackCommand( $command );

        $haystack = explode( "\n", $keypairOutput );

        $ipid = '';
        foreach( $haystack as $result ) {
            if( preg_match( '/'.$ip.'/', $result ) ) {
                $idsegments = explode( '|', $result );
                $ipid = $idsegments[1];
            }
        }
//        if( count($haystack)>1 ) {
//            print_r($haystack);
//            return "Error: too many results for $ip";
//        }

//        print_r($idsegments);

        if( empty( $ipid ) ) {
            return "IP $ip not found";
        }

        $command = "neutron floatingip-disassociate".$ipid;

//        echo $command;

        self::openStackCommand($command);

//        # sleep for 2 seconds so that neutron has time to disassociate the floating IP before disposal starts
//        sleep( 2 );

//        heads = {'X-Auth-Token':token, 'X-Tenant-Name':'mesz', 'Content-Type':'text/occi', 'Accept':'text/occi'}
//        curl -v -X DELETE http://localhost:8080 -H 'Content-Type: text/occi' -H 'Accept: text/occi' -H 'X-Tenant-Name: mesz' -H 'X-Auth-Token: eafb5286fba5447fb048c06f2e34190a'
        $command = "curl -v -X DELETE ".Controller::$url." -H 'Content-type: text/occi' -H 'Accept: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT'";

        return self::obSystem($command);;
    }


    public static function getClusterState($KID, $TENANT="") {
        $TENANT = self::checkContent( $TENANT, self::$tenant );

        //curl -v -X GET http://localhost:8080/orchestrator/default -H 'X-Auth-Token: a2d02f384211478aae2dd12ddbc3fd35' -H 'X-Tenant-Name: mesz' -H 'Content-Type: text/occi' -H 'Accept: text/occi'

        $command = "curl -v -X GET ".Controller::$url."/orchestrator/default -H 'X-Auth-Token: {$KID}' -H 'X-Tenant-Name: {$TENANT}' -H 'Content-Type: text/occi' -H 'Accept: text/occi' 2>&1";

        return self::obSystem($command);;
    }

}