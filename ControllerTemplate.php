<?php

require_once("ControllerTemplate.php");

/**
 * Created by PhpStorm.
 * User: puenktli
 * Date: 06/01/16
 * Time: 11:29
 */
interface ControllerTemplate
{
    static function obSystem( $command );

    public static function openStackCommand( $command );
}