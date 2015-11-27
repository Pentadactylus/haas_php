<?php
/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 23/11/15
 * Time: 11:32
 */

$teststring = "+-------------+-------------------------------------------------+
| Name        | Fingerprint                                     |
+-------------+-------------------------------------------------+
| mesz MNMBA  | ef:27:2c:0e:34:b5:d2:b4:09:5d:9c:51:de:7b:4d:18 |
| MNMBA2      | ef:27:2c:0e:34:b5:d2:b4:09:5d:9c:51:de:7b:4d:18 |
| Work Laptop | 6e:52:98:ed:21:4e:03:d6:d8:78:e2:65:86:c5:ba:60 |
+-------------+-------------------------------------------------+";
$haystack = explode( "\n", $teststring );
for( $i=3; $i<count($haystack)-1; $i++ ) {
    $stack2 = explode( "|", $haystack[$i]);
    $out = trim($stack2[1].$stack2[2]);
    if( $out!="")
        echo $out."\n";
}


?>
