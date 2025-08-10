<?php

// Route pour ajouter un nouveau colis
$routes[] = [
    'method' => 'POST',
    'path' => '/api/colis',
    'action' => function() {
        header('Content-Type: application/json');
        $required = [
            'code', 'nombre', 'poids', 'prix', 'typeproduit', 'etat',
            'expediteur_nom', 'expediteur_prenom', 'expediteur_telephone', 'expediteur_adresse',
            'destinataire_nom', 'destinataire_prenom', 'destinataire_telephone', 'destinataire_adresse',
            'cargaison_id', 'dateCreation'
        ];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                echo json_encode(['statut' => 'erreur', 'message' => "Champ manquant : $field"]);
                return;
            }
        }

        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        if (!isset($data['colis'])) $data['colis'] = [];

        $nouveauColis = [
            'code' => $_POST['code'],
            'nombre' => (int)$_POST['nombre'],
            'poids' => (float)$_POST['poids'],
            'prix' => (float)$_POST['prix'],
            'typeproduit' => $_POST['typeproduit'],
            'etat' => $_POST['etat'],
            'expediteur' => [
                'nom' => $_POST['expediteur_nom'],
                'prenom' => $_POST['expediteur_prenom'],
                'telephone' => $_POST['expediteur_telephone'],
                'adresse' => $_POST['expediteur_adresse']
            ],
            'destinataire' => [
                'nom' => $_POST['destinataire_nom'],
                'prenom' => $_POST['destinataire_prenom'],
                'telephone' => $_POST['destinataire_telephone'],
                'adresse' => $_POST['destinataire_adresse']
            ],
            'cargaisonId' => (int)$_POST['cargaison_id'],
            'dateCreation' => $_POST['dateCreation'],
            'dateArchivage' => $_POST['dateArchivage'] ?? null
        ];

        $data['colis'][] = $nouveauColis;

        // Associer le colis à la cargaison correspondante
        if (isset($data['cargaisons'])) {
            foreach ($data['cargaisons'] as &$cargaison) {
                if ($cargaison['id'] == $nouveauColis['cargaisonId']) {
                    if (!isset($cargaison['colis'])) $cargaison['colis'] = [];
                    $cargaison['colis'][] = $nouveauColis['code'];
                }
            }
        }

        file_put_contents($dbPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode(['statut' => 'succès', 'message' => 'Colis ajouté', 'colis' => $nouveauColis]);
    }
];
// Route pour ajouter une nouvelle cargaison
$routes[] = [
    'method' => 'POST',
    'path' => '/api/cargaison',
    'action' => function() {
        header('Content-Type: application/json');
        $required = ['type_transport', 'capacite', 'ville_depart', 'ville_arrivee', 'date_depart', 'date_arrivee'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                echo json_encode(['statut' => 'erreur', 'message' => "Champ manquant : $field"]);
                return;
            }
        }

        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        if (!isset($data['cargaisons'])) $data['cargaisons'] = [];

        // Générer un nouvel ID unique
        $newId = count($data['cargaisons']) > 0 ? max(array_column($data['cargaisons'], 'id')) + 1 : 1;

        $nouvelleCargaison = [
            'id' => $newId,
            'type' => $_POST['type_transport'],
            'capacite' => (int)$_POST['capacite'],
            'lieuDepart' => $_POST['ville_depart'],
            'lieuArrive' => $_POST['ville_arrivee'],
            'dateDepart' => $_POST['date_depart'],
            'dateArrivee' => $_POST['date_arrivee'],
            'etat' => 'EN_ATTENTE',
            'colis' => []
        ];

        $data['cargaisons'][] = $nouvelleCargaison;
        file_put_contents($dbPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode(['statut' => 'succès', 'message' => 'Cargaison ajoutée', 'cargaison' => $nouvelleCargaison]);
    }
];


function genererMessage($colis) {
    switch ($colis['etat']) {
        case 'EN_COURS':
            return 'Votre colis est en cours de transport';
        case 'ARRIVE':
            return 'Votre colis est arrivé à destination et prêt pour récupération';
        case 'EN_ATTENTE':
            return 'Votre colis est en attente de chargement dans la cargaison';
        default:
            return 'État du colis : ' . $colis['etat'];
    }
}

function getTypeCargaison($cargaisonId, $data) {
    if (!$cargaisonId || !isset($data['cargaisons'])) {
        return 'Non assigné';
    }
    
    foreach ($data['cargaisons'] as $cargaison) {
        if ($cargaison['id'] == $cargaisonId) {
            switch ($cargaison['type']) {
                case 'MARITIME': return 'Maritime';
                case 'AERIENNE': return 'Aérien';
                case 'ROUTIERE': return 'Routier';
                default: return $cargaison['type'];
            }
        }
    }
    
    return 'Non trouvé';
}

function getCargaisonDetails($cargaisonId, $data) {
    if (!$cargaisonId || !isset($data['cargaisons'])) {
        return null;
    }
    
    foreach ($data['cargaisons'] as $cargaison) {
        if ($cargaison['id'] == $cargaisonId) {
            return $cargaison;
        }
    }
    
    return null;
}

function getPositionActuelle($etat, $cargaison) {
    if (!$cargaison) {
        return null;
    }
    
    $depart = $cargaison['lieuDepart'];
    $arrivee = $cargaison['lieuArrive'];
    
    switch ($etat) {
        case 'EN_ATTENTE':
            return $depart;
        case 'EN_COURS':
            // Position intermédiaire (approximative)
            return [
                'nom' => 'En transit',
                'latitude' => ($depart['latitude'] + $arrivee['latitude']) / 2,
                'longitude' => ($depart['longitude'] + $arrivee['longitude']) / 2
            ];
        case 'ARRIVE':
            return $arrivee;
        default:
            return $depart;
    }
}

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
            
            // Charger les données depuis database.json
            $dbPath = dirname(__DIR__) . '/data/database.json';
            $data = [];
            if (file_exists($dbPath)) {
                $data = json_decode(file_get_contents($dbPath), true);
            }
            
            $colis_demo = [];
            if (isset($data['colis'])) {
                foreach ($data['colis'] as $colis) {
                    $cargaison = getCargaisonDetails($colis['cargaisonId'], $data);
                    $colis_demo[$colis['code']] = [
                        'etat' => $colis['etat'],
                        'message' => genererMessage($colis),
                        'expediteur' => trim($colis['expediteur']['nom'] . ' ' . $colis['expediteur']['prenom']),
                        'destinataire' => trim($colis['destinataire']['nom'] . ' ' . $colis['destinataire']['prenom']),
                        'type_cargaison' => getTypeCargaison($colis['cargaisonId'], $data),
                        'poids' => $colis['poids'] . ' kg',
                        'dateCreation' => $colis['dateCreation'],
                        'coordonnees' => $cargaison ? [
                            'depart' => $cargaison['lieuDepart'],
                            'arrivee' => $cargaison['lieuArrive'],
                            'position_actuelle' => getPositionActuelle($colis['etat'], $cargaison)
                        ] : null
                    ];
                }
            }
            
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

return $routes;

