<?php

namespace App\Core;
class Session 
{
    private static ?Session $instance = null;
    
    private function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    public static function get(string $key)
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return $_SESSION[$key] ?? null;
    }


    
    public static function isAuthenticated(): bool
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return isset($_SESSION['user']);
    }
    
    public static function getUser()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return $_SESSION['user'] ?? null;
    }
}