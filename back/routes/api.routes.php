<?php
// Routes API pour l'intégration TypeScript
return [
    // API de suivi de colis (via TypeScript)
    [
        'method' => 'POST',
        'path' => '/api/ts/suivi',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $input = json_decode(file_get_contents('php://input'), true);
            $code = $input['code'] ?? '';
            
            if (empty($code)) {
                echo json_encode([
                    'statut' => 'erreur',
                    'message' => 'Code de suivi requis'
                ]);
                return;
            }
            
            // Appeler le service TypeScript
            $result = App\Core\TypeScriptBridge::suivreColis($code);
            echo json_encode($result);
        }
    ],
    
    // API pour obtenir toutes les cargaisons
    [
        'method' => 'GET',
        'path' => '/api/ts/cargaisons',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $result = App\Core\TypeScriptBridge::getAllCargaisons();
            echo json_encode($result);
        }
    ],
    
    // API pour obtenir tous les colis
    [
        'method' => 'GET',
        'path' => '/api/ts/colis',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $result = App\Core\TypeScriptBridge::getAllColis();
            echo json_encode($result);
        }
    ],
    
    // API pour créer une cargaison
    [
        'method' => 'POST',
        'path' => '/api/ts/cargaisons',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $result = App\Core\TypeScriptBridge::creerCargaison($input);
            echo json_encode($result);
        }
    ],
    
    // API pour ajouter un colis
    [
        'method' => 'POST',
        'path' => '/api/ts/colis',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $result = App\Core\TypeScriptBridge::ajouterColis($input);
            echo json_encode($result);
        }
    ],
    
    // API pour changer l'état d'un colis
    [
        'method' => 'PUT',
        'path' => '/api/ts/colis/etat',
        'action' => function() {
            header('Content-Type: application/json');
            
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $input = json_decode(file_get_contents('php://input'), true);
            $code = $input['code'] ?? '';
            $etat = $input['etat'] ?? '';
            
            if (empty($code) || empty($etat)) {
                echo json_encode([
                    'statut' => 'erreur',
                    'message' => 'Code et état requis'
                ]);
                return;
            }
            
            $result = App\Core\TypeScriptBridge::changerEtatColis($code, $etat);
            echo json_encode($result);
        }
    ],
    
    // Page de test TypeScript
    [
        'method' => 'GET',
        'path' => '/test-ts',
        'action' => function() {
            require_once dirname(__DIR__) . '/app/core/TypeScriptBridge.php';
            
            $nodeCheck = App\Core\TypeScriptBridge::checkNodeJs();
            
            echo '<!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Test TypeScript Bridge</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 p-8">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl font-bold mb-6">🔗 Test TypeScript Bridge</h1>
                    
                    <div class="bg-white rounded-lg p-6 mb-6">
                        <h2 class="text-xl font-semibold mb-4">🟢 État de Node.js</h2>
                        <pre class="bg-gray-100 p-4 rounded overflow-x-auto">' . json_encode($nodeCheck, JSON_PRETTY_PRINT) . '</pre>
                    </div>
                    
                    <div class="bg-white rounded-lg p-6 mb-6">
                        <h2 class="text-xl font-semibold mb-4">🧪 Test APIs TypeScript</h2>
                        <div class="grid md:grid-cols-2 gap-4">
                            <button onclick="testSuivi()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                📦 Tester Suivi COL001
                            </button>
                            <button onclick="testCargaisons()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                🚢 Lister Cargaisons
                            </button>
                            <button onclick="testColis()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                                📋 Lister Colis
                            </button>
                            <button onclick="testCreerCargaison()" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                                ➕ Créer Cargaison
                            </button>
                        </div>
                        <div id="result" class="mt-4"></div>
                    </div>
                    
                    <div class="bg-white rounded-lg p-6">
                        <h2 class="text-xl font-semibold mb-4">📋 Instructions</h2>
                        <ol class="list-decimal list-inside space-y-2">
                            <li>Compilez TypeScript: <code class="bg-gray-100 px-2 py-1 rounded font-mono">npm run build</code></li>
                            <li>Vérifiez que Node.js est installé</li>
                            <li>Testez les APIs via ce dashboard</li>
                            <li>Intégrez avec vos vues PHP en utilisant les endpoints <code>/api/ts/*</code></li>
                        </ol>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <h3 class="font-semibold text-blue-800">🔗 Endpoints disponibles:</h3>
                        <ul class="text-sm text-blue-700 mt-2 space-y-1">
                            <li><code>POST /api/ts/suivi</code> - Suivi de colis</li>
                            <li><code>GET /api/ts/cargaisons</code> - Liste des cargaisons</li>
                            <li><code>GET /api/ts/colis</code> - Liste des colis</li>
                            <li><code>POST /api/ts/cargaisons</code> - Créer une cargaison</li>
                            <li><code>POST /api/ts/colis</code> - Ajouter un colis</li>
                            <li><code>PUT /api/ts/colis/etat</code> - Changer état colis</li>
                        </ul>
                    </div>
                </div>
                
                <script>
                function showResult(data, title = "Résultat") {
                    document.getElementById("result").innerHTML = 
                        `<h3 class="font-semibold mb-2">${title}</h3>` +
                        "<pre class=\"bg-gray-100 p-4 rounded overflow-x-auto\">" + 
                        JSON.stringify(data, null, 2) + 
                        "</pre>";
                }
                
                function showError(message) {
                    document.getElementById("result").innerHTML = 
                        "<div class=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded\">" + 
                        "❌ Erreur: " + message + 
                        "</div>";
                }
                
                async function testSuivi() {
                    try {
                        const response = await fetch("/api/ts/suivi", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code: "COL001" })
                        });
                        const data = await response.json();
                        showResult(data, "📦 Suivi COL001");
                    } catch (error) {
                        showError(error.message);
                    }
                }
                
                async function testCargaisons() {
                    try {
                        const response = await fetch("/api/ts/cargaisons");
                        const data = await response.json();
                        showResult(data, "🚢 Liste des Cargaisons");
                    } catch (error) {
                        showError(error.message);
                    }
                }
                
                async function testColis() {
                    try {
                        const response = await fetch("/api/ts/colis");
                        const data = await response.json();
                        showResult(data, "📋 Liste des Colis");
                    } catch (error) {
                        showError(error.message);
                    }
                }
                
                async function testCreerCargaison() {
                    try {
                        const response = await fetch("/api/ts/cargaisons", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                type: "MARITIME",
                                capacite: 50,
                                lieuDepart: "Dakar",
                                lieuArrive: "Marseille",
                                dateDepart: "2025-02-01",
                                dateArrive: "2025-02-15"
                            })
                        });
                        const data = await response.json();
                        showResult(data, "➕ Création Cargaison");
                    } catch (error) {
                        showError(error.message);
                    }
                }
                </script>
            </body>
            </html>';
        }
    ]
];
