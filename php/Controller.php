<?php

require 'vendor/autoload.php';

require 'config.php';

class Controller {
    protected static $tenant = 'mesz';
    protected static $url = 'http://127.0.0.1:8888';
    protected static $username = 'ubuntu';
    protected static $idRsaPath = '/Users/puenktli/.ssh/id_rsa';
    // this file needs to have the password (OS_PASSWORD) inserted as no
//    protected static $openStackVars = '/Users/puenktli/Documents/ZHAW/CRUS/OpenStack login files/lisamesz.sh';

    /*
     * getter function for the config variables
     */
    protected static function getCurl() {
        return DISCOConfig::$curl;
    }

    protected static function getKeystone() {
        return DISCOConfig::$keystone;
    }

    protected static function getNova() {
        return DISCOConfig::$nova;
    }

    protected static function getNeutron() {
        return DISCOConfig::$neutron;
    }

    protected static function getUrl() {
        return DISCOConfig::$url;
    }

    protected static function getService() {
        return DISCOConfig::$service;
    }

    protected static function getAuthUrl() {
        return DISCOConfig::$authurl;
    }

    protected static function getRootFolder() {
        return DISCOConfig::$rootFolder;
    }

    protected static function getLogFile() {
        return DISCOConfig::$logFile;
    }

    protected static function getSSH() {
        return DISCOConfig::$ssh;
    }

    protected static function checkContent( $contentToCheck, $alternateContent ) {
        return empty($contentToCheck) ? $alternateContent : $contentToCheck;
    }

    public static function log( $message ) {
        $logfile = Controller::getLogFile();
        if( $logfile!='' ) {
            file_put_contents($logfile, $message . "\n", FILE_APPEND | LOCK_EX);
        }
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
     * authenticate() will check whether the given user is allowed to access OpenStack or not.
     * return   true    accepted
     *          false   not accepted
     */
    public static function authenticate( $input ) {
        $authURL = Controller::getAuthUrl();
        $keystone = self::getKeystone();

        $command = "{$keystone} --os-auth-url \"{$authURL}\" --os-region-name \"{$input['region']}\" --os-tenant-name \"{$input['tenant']}\" --os-password \"{$input['password']}\" --os-username \"{$input['username']}\" token-get";
        Controller::log($command);
        $output = self::obSystem($command);
        Controller::log($output);
        if( stristr( $output, 'tenant_id' ) ) {
            return true;
        }
        return false;
    }

//    public static function getServiceType( $KID, $TENANT="", $URL="" ) {
//        $TENANT = self::checkContent( $TENANT, self::$tenant );
//        $URL = self::checkContent( $URL, self::$url );
//
//        return self::obSystem("curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' $URL/-/");
//    }

//    public static function getServices( $KID, $TENANT="" ) {
//        $TENANT = self::checkContent( $TENANT, self::$tenant );
//        $url = self::$url;
//        $service = self::getService();
//
//        $retval = self::obSystem("curl -v -X GET -H 'Content-type: text/occi' -H 'X-Auth-Token: $KID' -H 'X-Tenant-Name: $TENANT' {$url}/{$service}/");
//        return $retval;
//    }

    public static function remoteSSH( $command, $ip, $user="", $idRsaPath="" ) {
        $user = self::checkContent( $user, self::$username );
        $idRsaPath = self::checkContent( $idRsaPath, self::$idRsaPath );
        $ssh = Controller::getSSH();

        return self::obSystem("{$ssh} -i {$idRsaPath} {$user}@{$ip} {$command}" );
    }

    public static function deleteInstance( $KID, $TENANT="" ) {

    }

    /*
     * getFlavors() returns all available flavours on OpenStack as a JSON string
     * $parameters has to contain username, password and tenant
     */
    public static function getFlavors($parameters) {
        $authurl = Controller::getAuthUrl();
        $username = $parameters['username'];
        $password = $parameters['password'];
        $tenant = $parameters['tenant'];
        $nova = self::getNova();
        $command = "{$nova} --os-username=\"{$username}\" --os-project-name=\"{$tenant}\" --os-auth-url=\"{$authurl}\" --os-password=\"{$password}\" flavor-list";
        $flavorOutput = self::obSystem($command);
        Controller::log($command);
        $haystack = explode ( "\n", $flavorOutput );
        $retVal = Array();
        for( $i=3; $i<count($haystack)-2; $i++ ) {
            $stack = explode( "|", $haystack[$i] );
            array_push( $retVal, Array( "id" => trim( $stack[1]), "name" => trim( $stack[2] ), "memory" => trim($stack[3]), "disk" => trim($stack[4]), "vcpu" => trim($stack[7])));
        }
        Controller::log($retVal);
        return json_encode( $retVal );
    }

//    public static function getVolumes($username,$password,$tenant) {
//        $authurl = Controller::getAuthUrl();
//        $command = "/usr/local/bin/cinder --os-username=\"{$username}\" --os-password=\"{$password}\" --os-tenant-name=\"{$tenant}\" --os-auth-url=\"{$authurl}\" list";
//        $volumeOutput = self::obSystem($command);
//        $haystack = explode ( "\n", $volumeOutput );
//        $retVal = Array();
//        for( $i=3; $i<(count($haystack)-2); $i++ ) {
//            $stack = explode( "|", $haystack[$i]);
//            $out = trim($stack[7]);
//            if( $out=="")
//                array_push( $retVal, Array( "id" => trim($stack[1]), "volume" => trim($stack[3])." (size: ".trim($stack[4])."GB)"));
//        }
//        return json_encode( $retVal );
//    }

    /*
     * getOSImages() returns all images on OpenStack which can be used as OS of a VM
     */
    public static function getOSImages($parameters) {
        $authurl = Controller::getAuthUrl();
        $username = $parameters['username'];
        $password = $parameters['password'];
        $tenant = $parameters['tenant'];
        $command = "/usr/local/bin/glance --os-username=\"{$username}\" --os-password=\"{$password}\" --os-tenant-name=\"{$tenant}\" --os-auth-url=\"{$authurl}\" image-list";
        $imageOutput = self::obSystem( $command );
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

//    public static function getFloatingIPs($parameters) {
//        $authurl = Controller::getAuthUrl();
//        $username = $parameters['username'];
//        $password = $parameters['password'];
//        $tenant = $parameters['tenant'];
//        $neutron = Controller::getNoutron();
//        $command = "{$neutron} --os-username=\"{$username}\" --os-password=\"{$password}\" --os-tenant-name=\"{$tenant}\" --os-auth-url=\"{$authurl}\" floatingip-list";
//        $floatingipOutput = self::obSystem( $command );
//        $haystack = explode( "\n", $floatingipOutput );
//        $retVal = Array(Array('id'=>'', 'ip'=>'create new floating IP'));
//        for( $i=3; $i<count($haystack)-2; $i++ ) {
//            $stack = explode( "|", $haystack[$i]);
//            if( preg_match("/^[\s]*$/",$stack[2]) ) {
//                array_push($retVal, Array('id' => trim($stack[1]), 'ip' => trim($stack[3])));
//            }
//        }
//        return json_encode( $retVal );
//    }

    /*
     * getRegisteredSSHKeys will return all registered SSH keys from OpenStack
     * $parameters has to contain username, password and tenant entries
     */
    public static function getRegisteredSSHKeys($parameters) {
        $authurl = Controller::getAuthUrl();
        $username = $parameters['username'];
        $password = $parameters['password'];
        $tenant = $parameters['tenant'];
        $nova = Controller::getNova();

        $command = "{$nova} --os-username=\"{$username}\" --os-password=\"{$password}\" --os-tenant-name=\"{$tenant}\" --os-auth-url=\"{$authurl}\" keypair-list";
        $keypairOutput = self::obSystem( $command );
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


    /*
     * createInstance will create a new cluster with the given parameters
     * $params has to contain entries username, password, tenant and region plus the specific parameters for the cluster's configuration (icclab.haas.*)
     * return JSON string with 'url' as url of newly created cluster and SM's comment as 'status'
     */
    public static function createInstance( $params ) {
        Controller::log("alright");

        $rootFolder = self::getRootFolder();
//        $slavecount = self::checkContent( $params['icclab.haas.slave.number'], 0);

        $reqParms = "";
        $credentials = array( "username", "password", "tenant", "region" );
        foreach( $params as $key => $value ) {
            if( !in_array( $key, $credentials ) ) {
                $reqParms .= ",{$key}=\"{$value}\"";
            }
        }
        $url = self::getUrl();
        $service = self::getService();

        $username = $params['username'];
        $password = $params['password'];
        $tenant = $params['tenant'];
        $region = $params ['region'];
        $curl = self::getCurl();

        $command = "{$curl} -v -X POST {$url}/{$service}/ -H 'Category: {$service}; scheme=\"http://schemas.cloudcomplab.ch/occi/sm#\"; class=\"kind\";' -H 'Content-type: text/occi' -H 'X-Tenant-Name: {$tenant}' -H 'X-Region-Name: {$region}' -H 'X-User-Name: {$username}' -H 'X-Password: {$password}' -H 'X-OCCI-Attribute: icclab.haas.rootfolder=\"{$rootFolder}\"{$reqParms}' 2>&1";
        # if the SO is to be deleted, I can just send the delete command to the SM (of course, to the appropriate address: url/oterm/serviceOrchestratorID) so that it gets deleted
        $result = self::obSystem($command);
        $retval = array();
        Controller::log($command);
        $haystack = explode( "\n", $result );
        foreach($haystack as $val) {
            if( preg_match('/Location: (.*)/',$val)) {

                $retval['url'] = preg_replace("/^.*Location: (.*)/", "$1", $val);
            }
        }
        $retval['status'] = $haystack[count($haystack)-1];

        return Zend\Json\Json::encode($retval);
    }
}

?>