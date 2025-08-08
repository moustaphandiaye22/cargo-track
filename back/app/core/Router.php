<?php

namespace App\Core;
class Router 
{
    public static function resolve(): void
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];
        $routes = require dirname(__DIR__, 2) . '/routes/route.web.php';
        
        foreach ($routes as $route) {
            if (strtoupper($route['method']) !== $method) continue;
            if ($route['path'] === $uri) {
                if (isset($route['action']) && is_callable($route['action'])) {
                    $route['action']();
                    return;
                }
            }
        }
        self::show404();
    }

    private static function show404(): void
    {
        http_response_code(404);
        echo '<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page non trouvée - CargoTrack</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-6xl font-bold text-gray-600">404</h1>
                <p class="text-xl text-gray-500 mb-4">Page non trouvée</p>
                <a href="/" class="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
                    Retour à l\'accueil
                </a>
            </div>
        </body>
        </html>';
    }
}