<?php
/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 10/05/16
 * Time: 14:17
 */

class DISCOConfig {
    /*
     * the path for keystone, nova, neutron and glance have to be provided
     */
    public static $keystone = '/usr/local/bin/keystone';
    public static $nova = '/usr/local/bin/nova';
    public static $neutron = '/usr/local/bin/neutron';
    public static $glance = '/usr/local/bin/glance';

    /*
     * so to curl and ssh
     */
    public static $curl = '/usr/bin/curl';
    public static $ssh = '/usr/bin/ssh';

    /*
     * url has to be set to the DISCO deployment; service can stay as is; authurl is the endpoint of OpenStack
     */
    public static $service = 'haas';
    public static $url = 'http://127.0.0.1:8888';
    public static $authurl = 'https://keystone.cloud.switch.ch:5000/v2.0';
//    public static $authurl = 'http://lisa.cloudcomplab.ch:35357/v2.0';

    /*
     * rootFolder is the data sm/managers/data folder on the DISCO deployment server; logFile is the path to the php log file where all commands will be logged to. Be aware: the log file will also contain the passwords! For turning logging off, just set it to an empty string.
     */
//    public static $rootFolder = '/home/ubuntu/disco/sm/managers/data';
//    public static $rootFolder = '/Users/puenktli/Documents/Coding/PycharmProjects/hurtle_sm/dataLisa';
//    public static $rootFolder = '/Users/puenktli/Documents/Coding/PycharmProjects/hurtle_sm/hurtle_sm-master/sm/managers/data';
    public static $logFile = '/Users/puenktli/Sites/WP3/phplog.log';
}

?>

