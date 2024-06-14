<?php

class Config
{
    public static function DB_NAME()
    {
        return Config::get_env("DB_NAME", "restaurant");
    }

    public static function DB_USERNAME()
    {
        return Config::get_env("DB_USERNAME", "root");
    }

    public static function DB_PASSWORD()
    {
        return Config::get_env("DB_PASSWORD", "");
    }

    public static function DB_HOST()
    {
        return Config::get_env("DB_HOST", "localhost");
    }

    public static function DB_PORT()
    {
        return Config::get_env("DB_PORT", "3306");
    }

    public static function JWT_SECRET()
    {
        return Config::get_env("JWT_SECRET", "web");
    }

    public static function HCAPTCHA_SERVER_SECRET()
    {
        return Config::get_env("HCAPTCHA_SERVER_SECRET", "ES_8f3f06d1189444cd97bddcb31f34349a");
    }

    public static function HCAPTCHA_SITE_KEY()
    {
        return Config::get_env("HCAPTCHA_SITE_KEY", "e82a6fc4-a47e-4738-9bc4-7ad44486cf74");
    }


    public static function get_env($name, $default)
    {
        return isset($_ENV[$name]) && trim($_ENV[$name]) !== "" ? $_ENV[$name] : $default;
    }
}
