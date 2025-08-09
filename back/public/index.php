<?php

// Configuration de base
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$autoloadPath = dirname(__DIR__, 2) . '/vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
}

require_once dirname(__DIR__) . '/app/core/App.php';
require_once dirname(__DIR__) . '/app/core/Router.php';
require_once dirname(__DIR__) . '/app/core/Session.php';

// Configuration des headers pour le développement
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Résoudre la route
    App\Core\Router::resolve();
} catch (Exception $e) {
    // Gestion des erreurs
    http_response_code(500);
    echo '<h1>Erreur 500</h1>';
    echo '<p>Erreur serveur: ' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p>Fichier: ' . $e->getFile() . ' (ligne ' . $e->getLine() . ')</p>';
}
