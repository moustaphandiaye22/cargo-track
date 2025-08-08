<?php

namespace App\Core;

class App 
{
    private static array $instances = [];
    
    
    public static function get(string $className)
    {
        if (!isset(self::$instances[$className])) {
            if (class_exists($className)) {
                self::$instances[$className] = new $className();
            } else {
                throw new \Exception("Classe '$className' non trouvée.");
            }
        }
        
        return self::$instances[$className];
    }
    
    public static function set(string $className, $instance): void
    {
        self::$instances[$className] = $instance;
    }
    
    /**
     * Vérifie si une classe est enregistrée
     */
    public static function has(string $className): bool
    {
        return isset(self::$instances[$className]);
    }
    
    /**
     * Supprime une instance du conteneur
     */
    public static function remove(string $className): void
    {
        unset(self::$instances[$className]);
    }
}
