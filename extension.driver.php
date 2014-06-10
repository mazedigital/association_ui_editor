<?php

Class extension_association_ui_editor extends Extension
{
    private static $provides = array();

    public static function registerProviders()
    {
        self::$provides = array(
            'association-editor' => array(
                'editor' => 'Editor'
            )
        );

        return true;
    }

    public static function providerOf($type = null)
    {
        self::registerProviders();

        if (is_null($type)) {
            return self::$provides;
        }

        if (!isset(self::$provides[$type])) {
            return array();
        }

        return self::$provides[$type];
    }

}
