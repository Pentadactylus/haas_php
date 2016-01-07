<?php


class Controller {
    protected static $tenant = 'mesz';
    protected static $url = 'http://localhost:8080';
    protected static $oterm = 'haas';
    protected static $username = 'ec2-user';
    protected static $idRsaPath = '/Users/puenktli/.ssh/id_rsa';
    // this file needs to have the password (OS_PASSWORD) inserted as no
    protected static $openStackVars = '/Users/puenktli/Documents/ZHAW/CRUS/OpenStack login files/lisamesz.sh';

    protected static function checkContent( $contentToCheck, $alternateContent ) {
        return empty($contentToCheck) ? $alternateContent : $contentToCheck;
    }

    /*
     * obSystem issues a given command to the terminal and returns
     */
    protected static function obSystem( $command ) {
        ob_start();
        // redirect stderr to stdout ->." 2>&1"
        system( $command );
        $output = ob_get_contents();
        ob_end_clean();
        return $output;
    }

    /*
     * openStackCommand executes a command of an OpenStack command line client such as heat. It ensures that the dependencies are always met by sourcing the required auth file.
     */
    protected static function openStackCommand( $command ) {
        $authFile = '"'.self::$openStackVars.'"';
        $command = "/bin/bash -c 'source {$authFile} && /usr/local/bin/{$command}'";
        return self::obSystem($command);
    }

    public static function getServiceType( $KID, $TENANT="", $URL="" ) {
        $TENANT = self::checkContent( $TENANT, self::$tenant );
        $URL = self::checkContent( $URL, self::$url );

        return self::obSystem("curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' $URL/-/");
    }

    public static function getServices( $KID, $TENANT="", $OTERM="", $URL="" ) {
        $TENANT = self::checkContent( $TENANT, self::$tenant );
        $URL = self::checkContent( $URL, self::$url );
        $OTERM = self::checkContent( $OTERM, self::$oterm );

        $retval = self::obSystem("curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' $URL/$OTERM/");
        return $retval;
    }

    public static function remoteSSH( $command, $ip, $user="", $idRsaPath="" ) {
        $user = self::checkContent( $user, self::$username );
        $idRsaPath = self::checkContent( $idRsaPath, self::$idRsaPath );

        return self::obSystem("ssh -i {$idRsaPath} {$user}@{$ip} {$command}" );
    }

    public static function getToken() {
        $result = self::openStackCommand("keystone token-get");
        $command = "echo '{$result}' | grep \" id \" | grep -oh \"\w*[0-9a-f]*\w\" | tail -n 1";
        return self::obSystem($command);
    }

    public static function deleteInstance( $KID, $TENANT="", $OTERM="" ) {

    }

    public static function getFlavors() {
        $command = "nova flavor-list";
        $flavorOutput = self::openStackCommand($command);
        $haystack = explode ( "\n", $flavorOutput );
        $retVal = Array();
        for( $i=3; $i<count($haystack)-2; $i++ ) {
            $stack = explode( "|", $haystack[$i] );
            array_push( $retVal, Array( "id" => trim( $stack[1]), "name" => trim( $stack[2] ), "memory" => trim($stack[3]), "disk" => trim($stack[4]), "vcpu" => trim($stack[7])));
        }
        return json_encode( $retVal );
    }

    public static function getOSImages() {
        $command = "glance image-list";
        $imageOutput = self::openStackCommand( $command );
        $haystack = explode( "\n", $imageOutput );
        $retVal = Array();
        for( $i=3; $i<count($haystack); $i++ ) {
            $stack = explode( "|", $haystack[$i]);
            $out = trim($stack[2]);
            if( $out!="")
                array_push( $retVal, Array( "id" => trim($stack[1]), "image" => trim($stack[2])));
        }
        return json_encode( $retVal );
    }

    public static function getFloatingIPs() {
        $command = "neutron floatingip-list";
        $floatingipOutput = self::openStackCommand( $command );
        $haystack = explode( "\n", $floatingipOutput );
        $retVal = Array(Array('id'=>'', 'ip'=>'create new floating IP'));
        for( $i=3; $i<count($haystack)-2; $i++ ) {
            $stack = explode( "|", $haystack[$i]);
            if( preg_match("/^[\s]*$/",$stack[2]) ) {
                array_push($retVal, Array('id' => trim($stack[1]), 'ip' => trim($stack[3])));
            }
        }
        return json_encode( $retVal );
    }

    public static function getRegisteredSSHKeys() {
        $command = "nova keypair-list";
        $keypairOutput = self::openStackCommand( $command );
        $haystack = explode( "\n", $keypairOutput );
        $retVal = Array();
        for( $i=3; $i<count($haystack)-1; $i++ ) {
            $stack = explode( "|", $haystack[$i]);
            $out = trim($stack[1]);
            if( $out!="")
                array_push( $retVal, Array( "fingerprint" => trim($stack[2]), "publickey" => trim($stack[1])));
        }
        return json_encode( $retVal );
    }
}

?>