<?php

/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 06/01/16
 * Time: 11:26
 */

require_once("Controller.php");

abstract class SMController extends Controller
{
    public static function createInstance( $params, $KID, $TENANT="", $OTERM="", $URL="" ) {
        $TENANT = self::checkContent( $TENANT, self::$tenant );
        $URL = self::checkContent( $URL, self::$url );
        $OTERM = self::checkContent( $OTERM, self::$oterm );
        $slavecount = self::checkContent( $params['slavecount'], 0);

        $retval = self::obSystem("curl -v -X POST $URL/$OTERM/ -H 'Category: '$OTERM'; scheme=\"http://schemas.cloudcomplab.ch/occi/sm#\"; class=\"kind\";' -H 'Content-type: text/occi' -H 'X-Auth-Token: '$KID -H 'X-Tenant-Name: '$TENANT -H 'X-OCCI-Attribute: icclab.haas.slave.number={$slavecount}'");
        return $retval;
    }


}