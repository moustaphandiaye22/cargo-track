<?php

namespace App\Core;

class TypeScriptAuth 
{
    private static $tsServerPath;
    
    public static function init()
    {
        if (!isset(self::$tsServerPath)) {
            self::$tsServerPath = dirname(__DIR__, 2) . '/../dist/server.js';
        }
    }
    
    public static function login($email, $password)
    {
        self::init();
        
        $loginData = json_encode([
            'email' => $email,
            'password' => $password
        ]);
        
        $command = "node " . escapeshellarg(self::$tsServerPath) . " login " . escapeshellarg($loginData);
        $output = shell_exec($command);
        
        if ($output === null) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur lors de l\'exécution du serveur TypeScript'
            ];
        }
        
        $result = json_decode(trim($output), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur de parsing JSON'
            ];
        }
        
        return $result;
    }
    
    public static function validateToken($token)
    {
        self::init();
        
        $command = "node " . escapeshellarg(self::$tsServerPath) . " validate-token " . escapeshellarg($token);
        $output = shell_exec($command);
        
        if ($output === null) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur lors de la validation du token'
            ];
        }
        
        $result = json_decode(trim($output), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur de parsing JSON'
            ];
        }
        
        return $result;
    }
    
    public static function logout()
    {
        self::init();
        
        $command = "node " . escapeshellarg(self::$tsServerPath) . " logout";
        $output = shell_exec($command);
        
        if ($output === null) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur lors de la déconnexion'
            ];
        }
        
        $result = json_decode(trim($output), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur de parsing JSON'
            ];
        }
        
        return $result;
    }
    
    public static function isAuthenticated()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['auth_token'])) {
            return false;
        }
        
        $validation = self::validateToken($_SESSION['auth_token']);
        
        return $validation['statut'] === 'succès';
    }
    
    public static function getUser()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['auth_token'])) {
            return null;
        }
        
        $validation = self::validateToken($_SESSION['auth_token']);
        
        if ($validation['statut'] === 'succès') {
            return $validation['user'] ?? null;
        }
        
        return null;
    }
    
    public static function setSessionToken($token)
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['auth_token'] = $token;
    }
    
    public static function clearSession()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        unset($_SESSION['auth_token']);
        unset($_SESSION['user']);
    }
}
