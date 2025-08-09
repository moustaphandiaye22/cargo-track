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
    

}
