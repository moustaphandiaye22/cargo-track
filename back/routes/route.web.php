<?php

// Inclure la logique métier
require_once dirname(__DIR__) . '/validation/BusinessLogic.php';
require_once dirname(__DIR__) . '/utils/RecuGenerator.php';

$routes = [];

// Route pour ajouter un nouveau colis
$routes[] = [
    'method' => 'POST',
    'path' => '/api/colis',
    'action' => function() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $required = [
            'nombre', 'poids', 'prix', 'typeproduit',
            'expediteur_nom', 'expediteur_prenom', 'expediteur_telephone', 'expediteur_adresse',
            'destinataire_nom', 'destinataire_prenom', 'destinataire_telephone', 'destinataire_adresse',
            'cargaison_id', 'dateCreation'
        ];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                $_SESSION['error_message'] = "Champ manquant : $field";
                header('Location: /dashboard');
                exit();
            }
        }

        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        if (!isset($data['colis'])) $data['colis'] = [];

        // Vérifier que la cargaison existe et est ouverte
        $cargaisonTrouvee = null;
        if (isset($data['cargaisons'])) {
            foreach ($data['cargaisons'] as $cargaison) {
                if ($cargaison['id'] == (int)$_POST['cargaison_id']) {
                    $cargaisonTrouvee = $cargaison;
                    break;
                }
            }
        }
        
        // Vérification avec la logique métier
        $canAdd = BusinessLogic::canAddPackageToShipment($cargaisonTrouvee);
        if (!$canAdd['valid']) {
            $_SESSION['error_message'] = $canAdd['message'];
            header('Location: /dashboard');
            exit();
        }

        // Validation métier selon le type de transport
        $typeCargaison = $cargaisonTrouvee['type'];
        $typeProduit = $_POST['typeproduit'];
        
        $validation = BusinessLogic::validateProductTransport($typeCargaison, $typeProduit);
        if (!$validation['valid']) {
            $_SESSION['error_message'] = $validation['message'];
            header('Location: /dashboard');
            exit();
        }

        // Appliquer le prix minimum (logique métier TS)
        $prix = BusinessLogic::applyMinimumPrice((float)$_POST['prix']);

        // Générer un nouvel ID unique pour le colis
        $newColisId = count($data['colis']) > 0 ? max(array_column($data['colis'], 'id')) + 1 : 1;
        
        // Générer un code automatique pour le colis (format COL + 3 chiffres)
        $random = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
        $codeGenere = "COL" . $random;

        $nouveauColis = [
            'id' => $newColisId,
            'code' => $codeGenere,
            'nombre' => (int)$_POST['nombre'],
            'poids' => (float)$_POST['poids'],
            'prix' => $prix, // Prix avec minimum appliqué
            'typeProduit' => $typeProduit,
            'etat' => 'EN_ATTENTE', // Toujours EN_ATTENTE à la création (logique TS)
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
            'dateArchivage' => null
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

        // Générer le reçu avec la logique TypeScript
        $recu = RecuGenerator::genererRecu($nouveauColis, $cargaisonTrouvee);
        
        if ($recu) {
            // Sauvegarder le reçu
            RecuGenerator::sauvegarderRecu($recu);
            
            // Stocker le numéro de reçu dans la session pour redirection
            $_SESSION['recu_genere'] = $recu['numerorecu'];
            $_SESSION['success_message'] = "Colis {$nouveauColis['code']} ajouté avec succès ! Reçu {$recu['numerorecu']} généré.";
        } else {
            $_SESSION['success_message'] = "Colis {$nouveauColis['code']} ajouté avec succès !";
        }
        
        header('Location: /dashboard');
        exit();
    }
];

// Route pour ajouter une nouvelle cargaison
$routes[] = [
    'method' => 'POST',
    'path' => '/api/cargaison',
    'action' => function() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $required = ['type', 'poidsMax', 'ville_depart', 'ville_arrivee', 'datedepart', 'datedarrive'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                $_SESSION['error_message'] = "Champ manquant : $field";
                header('Location: /dashboard');
                exit();
            }
        }

        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        if (!isset($data['cargaisons'])) $data['cargaisons'] = [];

        // Générer un nouvel ID unique
        $newId = count($data['cargaisons']) > 0 ? max(array_column($data['cargaisons'], 'id')) + 1 : 1;

        // Générer un numéro unique pour la cargaison (conforme au service TS)
        $numero = rand(100, 999);
        
        $nouvelleCargaison = [
            'id' => $newId,
            'numero' => $numero,
            'type' => $_POST['type'],
            'poidsMax' => (float)$_POST['poidsMax'],
            'prixtotal' => (float)($_POST['prixtotal'] ?? 0),
            'distance' => (float)($_POST['distance'] ?? 0),
            'etatGlobal' => $_POST['etatglobal'] ?? 'OUVERT',
            'etatAvancement' => $_POST['etatAvancement'] ?? 'EN_ATTENTE',
            'lieuDepart' => [
                'nom' => $_POST['ville_depart'],
                'latitude' => (float)($_POST['coord_depart_lat'] ?? 0),
                'longitude' => (float)($_POST['coord_depart_long'] ?? 0)
            ],
            'lieuArrive' => [
                'nom' => $_POST['ville_arrivee'], 
                'latitude' => (float)($_POST['coord_arrive_lat'] ?? 0),
                'longitude' => (float)($_POST['coord_arrive_long'] ?? 0)
            ],
            'dateDepart' => $_POST['datedepart'],
            'dateArrive' => $_POST['datedarrive'],
            'dateCreation' => date('Y-m-d'),
            'poidsActuel' => 0,
            'colis' => []
        ];

        $data['cargaisons'][] = $nouvelleCargaison;
        file_put_contents($dbPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $_SESSION['success_message'] = "Cargaison #{$nouvelleCargaison['numero']} créée avec succès !";
        header('Location: /dashboard');
        exit();
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

// Routes principales
$routes[] = [
    'method' => 'GET',
    'path' => '/',
    'action' => function() {
        require_once dirname(__DIR__) . '/template/acceuil.php';
    }
];

$routes[] = [
    'method' => 'GET',
    'path' => '/login',
    'action' => function() {
        require_once dirname(__DIR__) . '/template/login/login.php';
    }
];

$routes[] = [
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
];

$routes[] = [
    'method' => 'GET',
    'path' => '/suivi',
    'action' => function() {
        require_once dirname(__DIR__) . '/template/client/suivi.php';
    }
];

$routes[] = [
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
];

// Dashboard gestionnaire (protégé)
$routes[] = [
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
];

$routes[] = [
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
];

// Route pour afficher un reçu
$routes[] = [
    'method' => 'GET',
    'path' => '/recu',
    'action' => function() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $numeroRecu = $_GET['numero'] ?? null;
        
        if (!$numeroRecu) {
            header('Location: /dashboard');
            exit();
        }
        
        $recu = RecuGenerator::getRecuParNumero($numeroRecu);
        
        if (!$recu) {
            $_SESSION['error_message'] = "Reçu $numeroRecu non trouvé";
            header('Location: /dashboard');
            exit();
        }
        
        // Afficher le reçu
        echo RecuGenerator::genererHTMLRecu($recu);
    }
];

return $routes;
