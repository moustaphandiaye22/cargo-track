<?php
$routes = [
    [
        'method' => 'GET',
        'path' => '/',
        'action' => function() {
            require_once dirname(__DIR__) . '/template/acceuil.php';
        }
    ],
    
    [
        'method' => 'GET',
        'path' => '/login',
        'action' => function() {
            require_once dirname(__DIR__) . '/template/login/login.php';
        }
    ],
    
    [
        'method' => 'POST',
        'path' => '/login',
        'action' => function() {
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';
            
            $valid_users = [
                'admin' => 'admin123',
                'gestionnaire' => 'gest123'
            ];
            
            if (isset($valid_users[$username]) && $valid_users[$username] === $password) {
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                $_SESSION['user'] = ['username' => $username, 'role' => 'gestionnaire'];
                header('Location: /dashboard');
                exit();
            } else {
                header('Location: /login?error=1');
                exit();
            }
        }
    ],
    
    [
        'method' => 'GET',
        'path' => '/suivi',
        'action' => function() {
            require_once dirname(__DIR__) . '/template/client/suivi.php';
        }
    ],
    
    [
        'method' => 'POST',
        'path' => '/api/suivi',
        'action' => function() {
            header('Content-Type: application/json');
            
            $input = json_decode(file_get_contents('php://input'), true);
            $code = $input['code'] ?? '';
            
            if (empty($code)) {
                echo json_encode([
                    'statut' => 'erreur',
                    'message' => 'Code de suivi requis'
                ]);
                return;
            }
            
            // Données de démonstration pour le suivi
            $colis_demo = [
                'COL001' => [
                    'etat' => 'EN_COURS',
                    'message' => 'Votre colis est en cours de transport maritime vers Paris',
                    'expediteur' => 'Jean Dupont',
                    'destinataire' => 'Marie Martin',
                    'type_cargaison' => 'Maritime'
                ],
                'COL002' => [
                    'etat' => 'ARRIVE',
                    'message' => 'Votre colis est arrivé à destination et prêt pour récupération',
                    'expediteur' => 'Société ABC',
                    'destinataire' => 'Client XYZ',
                    'type_cargaison' => 'Aérien'
                ],
                'COL003' => [
                    'etat' => 'EN_ATTENTE',
                    'message' => 'Votre colis est en attente de chargement dans la cargaison',
                    'expediteur' => 'Commerce Local',
                    'destinataire' => 'Famille Diallo',
                    'type_cargaison' => 'Routier'
                ]
            ];
            
            if (isset($colis_demo[strtoupper($code)])) {
                echo json_encode([
                    'statut' => 'succès',
                    'data' => $colis_demo[strtoupper($code)]
                ]);
            } else {
                echo json_encode([
                    'statut' => 'erreur',
                    'message' => 'Code de suivi non trouvé'
                ]);
            }
        }
    ],
    
    // Dashboard gestionnaire (protégé)
    [
        'method' => 'GET',
        'path' => '/dashboard',
        'action' => function() {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            if (!isset($_SESSION['user'])) {
                header('Location: /login');
                exit();
            }
            require_once dirname(__DIR__) . '/template/gestionnaire/dashboard.php';
        }
    ],
    
    [
        'method' => 'GET',
        'path' => '/logout',
        'action' => function() {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            session_destroy();
            header('Location: /');
            exit();
        }
    ]
];

// Fusionner avec les routes API TypeScript
$apiRoutes = require __DIR__ . '/api.routes.php';
return array_merge($routes, $apiRoutes);

