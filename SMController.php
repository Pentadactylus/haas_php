<?php

/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 06/01/16
 * Time: 11:26
 */

require_once("Controller.php");

class SMController extends Controller
{
    public static function createInstance( $params, $KID, $TENANT="", $OTERM="", $URL="" ) {
        $TENANT = self::checkContent( $TENANT, self::$tenant );
        $URL = self::checkContent( $URL, self::$url );
        $OTERM = self::checkContent( $OTERM, self::$oterm );
        $rootFolder = self::$rootFolder;
        $slavecount = self::checkContent( $params['slavecount'], 0);

        $command = "curl -v -X POST $URL/$OTERM/ -H 'Category: $OTERM; scheme=\"http://schemas.cloudcomplab.ch/occi/sm#\"; class=\"kind\";' -H 'Content-type: text/occi' -H 'X-Auth-Token: {$KID}' -H 'X-Tenant-Name: {$TENANT}' -H 'X-OCCI-Attribute: icclab.haas.slave.number=\"{$slavecount}\",icclab.haas.rootfolder=\"{$rootFolder}\"'";
        # if the SO is to be deleted, I can just send the delete command to the SM (of course, to the appropriate address: url/oterm/serviceOrchestratorID) so that it gets deleted
        $retval = self::obSystem($command);
        echo $command;
        return $retval;
    }


}