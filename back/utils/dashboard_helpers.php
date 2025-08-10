<?php

/**
 * Charge les données depuis le fichier database.json
 * @return array|null Les données de la base ou null en cas d'erreur
 */
function loadDatabaseData() {
    $jsonPath = __DIR__ . '/../data/database.json';
    
    if (!file_exists($jsonPath)) {
        error_log("Fichier database.json introuvable : " . $jsonPath);
        return null;
    }
    
    $jsonContent = file_get_contents($jsonPath);
    if ($jsonContent === false) {
        error_log("Impossible de lire le fichier database.json");
        return null;
    }
    
    $data = json_decode($jsonContent, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Erreur JSON : " . json_last_error_msg());
        return null;
    }
    
    return $data;
}

/**
 * Calcule les statistiques pour le dashboard
 * @param array $data Les données de la base
 * @return array Les statistiques calculées
 */
function calculerStatistiques($data) {
    $stats = [
        'colis_actifs' => 0,
        'nombre_cargaisons' => 0,
        'colis_en_transit' => 0,
        'nombre_clients' => 0
    ];
    
    if (!$data) return $stats;
    
    // Nombre de cargaisons
    $stats['nombre_cargaisons'] = count($data['cargaisons'] ?? []);
    
    // Calculs sur les colis
    $colis = $data['colis'] ?? [];
    $stats['colis_actifs'] = count(array_filter($colis, function($colis) {
        return $colis['etat'] !== 'ARCHIVE';
    }));
    
    $stats['colis_en_transit'] = count(array_filter($colis, function($colis) {
        return in_array($colis['etat'], ['EN_COURS', 'EN_TRANSIT']);
    }));
    
    // Nombre de clients (type CLIENT uniquement)
    $personnes = $data['personnes'] ?? [];
    $stats['nombre_clients'] = count(array_filter($personnes, function($personne) {
        return $personne['type'] === 'CLIENT';
    }));
    
    return $stats;
}

/**
 * Génère le HTML pour le tableau des cargaisons
 * @param array $data Les données de la base
 * @return string Le HTML du tableau
 */
function genererTableauCargaisons($data) {
    if (!$data || !isset($data['cargaisons'])) {
        return '<tr><td colspan="6" class="px-6 py-4 text-center text-medium-gray">Aucune cargaison trouvée</td></tr>';
    }
    
    $html = '';
    $cargaisons = $data['cargaisons'];
    $colis = $data['colis'] ?? [];
    
    foreach ($cargaisons as $cargaison) {
        // Compter les colis de cette cargaison
        $colisCount = count(array_filter($colis, function($colis) use ($cargaison) {
            return $colis['cargaisonId'] === $cargaison['id'];
        }));
        
        // Déterminer la couleur de l'état
        $etatClass = 'bg-medium-gray';
        $etatText = $cargaison['etatAvancement'];
        
        switch ($cargaison['etatAvancement']) {
            case 'EN_ATTENTE':
                $etatClass = 'bg-golden';
                $etatText = 'En Attente';
                break;
            case 'EN_COURS':
                $etatClass = 'bg-coral';
                $etatText = 'En Transit';
                break;
            case 'ARRIVE':
                $etatClass = 'bg-emerald';
                $etatText = 'Arrivé';
                break;
        }
        
        // Déterminer la couleur du type
        $typeClass = 'bg-emerald';
        $typeText = ucfirst(strtolower($cargaison['type']));
        
        switch ($cargaison['type']) {
            case 'MARITIME':
                $typeClass = 'bg-emerald';
                break;
            case 'AERIENNE':
                $typeClass = 'bg-golden';
                $typeText = 'Aérien';
                break;
            case 'ROUTIERE':
                $typeClass = 'bg-coral';
                $typeText = 'Routier';
                break;
        }
        
        $route = $cargaison['lieuDepart']['nom'] . ' → ' . $cargaison['lieuArrive']['nom'];
        
        $html .= '
        <tr class="hover:bg-light-gray transition-colors">
            <td class="px-6 py-4 font-semibold text-charcoal">' . htmlspecialchars($cargaison['numero']) . '</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ' . $typeClass . ' text-white rounded-full text-sm">' . $typeText . '</span>
            </td>
            <td class="px-6 py-4 text-medium-gray">' . htmlspecialchars($route) . '</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ' . $etatClass . ' text-white rounded-full text-sm">' . $etatText . '</span>
            </td>
            <td class="px-6 py-4 text-medium-gray">' . $colisCount . '/' . $cargaison['poidsMax'] . '</td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="text-emerald hover:bg-emerald hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-golden hover:bg-golden hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-coral hover:bg-coral hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>';
    }
    
    return $html;
}

/**
 * Génère le HTML pour le tableau des colis
 * @param array $data Les données de la base
 * @return string Le HTML du tableau
 */
function genererTableauColis($data) {
    if (!$data || !isset($data['colis'])) {
        return '<tr><td colspan="6" class="px-6 py-4 text-center text-medium-gray">Aucun colis trouvé</td></tr>';
    }
    
    $html = '';
    $colis = $data['colis'];
    
    foreach ($colis as $col) {
        // Déterminer la couleur de l'état
        $etatClass = 'bg-medium-gray';
        $etatText = $col['etat'];
        
        switch ($col['etat']) {
            case 'EN_ATTENTE':
                $etatClass = 'bg-golden';
                $etatText = 'En Attente';
                break;
            case 'EN_COURS':
                $etatClass = 'bg-coral';
                $etatText = 'En Transit';
                break;
            case 'ARRIVE':
                $etatClass = 'bg-emerald';
                $etatText = 'Arrivé';
                break;
            default:
                $etatClass = 'bg-medium-gray';
                $etatText = ucfirst(strtolower(str_replace('_', ' ', $col['etat'])));
        }
        
        $expediteur = trim($col['expediteur']['prenom'] . ' ' . $col['expediteur']['nom']);
        $destinataire = trim($col['destinataire']['prenom'] . ' ' . $col['destinataire']['nom']);
        
        $html .= '
        <tr class="hover:bg-light-gray transition-colors">
            <td class="px-6 py-4 font-semibold text-charcoal">' . htmlspecialchars($col['code']) . '</td>
            <td class="px-6 py-4 text-medium-gray">' . htmlspecialchars($expediteur) . '</td>
            <td class="px-6 py-4 text-medium-gray">' . htmlspecialchars($destinataire) . '</td>
            <td class="px-6 py-4 text-medium-gray">' . $col['poids'] . ' kg</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ' . $etatClass . ' text-white rounded-full text-sm">' . $etatText . '</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="text-emerald hover:bg-emerald hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-golden hover:bg-golden hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-coral hover:bg-coral hover:text-white px-3 py-1 rounded transition-all">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>';
    }
    
    return $html;
}

/**
 * Génère le HTML pour les cartes des clients
 * @param array $data Les données de la base
 * @return string Le HTML des cartes
 */
function genererCarteClients($data) {
    if (!$data || !isset($data['personnes'])) {
        return '<div class="col-span-full text-center text-medium-gray py-8">Aucun client trouvé</div>';
    }
    
    $html = '';
    $personnes = $data['personnes'];
    $colis = $data['colis'] ?? [];
    
    // Filtrer pour ne garder que les clients
    $clients = array_filter($personnes, function($personne) {
        return $personne['type'] === 'CLIENT';
    });
    
    foreach ($clients as $client) {
        // Compter les colis envoyés par ce client
        $colisEnvoyes = count(array_filter($colis, function($col) use ($client) {
            // Utiliser plusieurs critères pour identifier le client (nom, prénom, téléphone)
            $expediteur = $col['expediteur'];
            return ($expediteur['nom'] === $client['nom'] && 
                    $expediteur['prenom'] === $client['prenom']) ||
                   (isset($expediteur['telephone']) && isset($client['telephone']) && 
                    $expediteur['telephone'] === $client['telephone']) ||
                   (isset($expediteur['email']) && isset($client['email']) && 
                    $expediteur['email'] === $client['email']);
        }));
        
        $nomComplet = trim($client['prenom'] . ' ' . $client['nom']);
        $icon = !empty($client['prenom']) ? 'fa-user' : 'fa-building';
        $typeClient = !empty($client['prenom']) ? 'Client Premium' : 'Entreprise';
        $colorClass = !empty($client['prenom']) ? 'bg-coral' : 'bg-emerald';
        
        $html .= '
        <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 ' . $colorClass . ' rounded-full flex items-center justify-center mr-4">
                    <i class="fas ' . $icon . ' text-white"></i>
                </div>
                <div>
                    <h3 class="font-bold text-charcoal">' . htmlspecialchars($nomComplet) . '</h3>
                    <p class="text-medium-gray text-sm">' . $typeClient . '</p>
                </div>
            </div>
            <div class="space-y-2 text-sm">
                <p class="text-medium-gray"><i class="fas fa-envelope text-coral mr-2"></i>' . htmlspecialchars($client['email']) . '</p>
                <p class="text-medium-gray"><i class="fas fa-phone text-coral mr-2"></i>' . htmlspecialchars($client['telephone']) . '</p>
                <p class="text-medium-gray"><i class="fas fa-box text-coral mr-2"></i>' . $colisEnvoyes . ' colis envoyés</p>
            </div>
            <div class="mt-4 flex space-x-2">
                <button class="flex-1 bg-emerald text-white py-2 rounded-lg text-sm hover:bg-opacity-90 transition-all">
                    <i class="fas fa-eye mr-1"></i>Voir
                </button>
                <button class="flex-1 bg-golden text-white py-2 rounded-lg text-sm hover:bg-opacity-90 transition-all">
                    <i class="fas fa-edit mr-1"></i>Modifier
                </button>
            </div>
        </div>';
    }
    
    return $html;
}

/**
 * Formatte un nombre avec des séparateurs de milliers
 * @param int $number Le nombre à formater
 * @return string Le nombre formaté
 */
function formatNumber($number) {
    return number_format($number, 0, ',', ' ');
}

/**
 * Calcule le pourcentage de variation par rapport au mois précédent
 * (Pour l'instant retourne des valeurs simulées)
 * @param string $type Le type de statistique
 * @return string Le pourcentage formaté avec signe
 */
function calculerVariation($type) {
    // Pour l'instant, retourner des valeurs simulées
    $variations = [
        'colis_actifs' => '+12',
        'nombre_cargaisons' => '+5',
        'colis_en_transit' => '0',
        'nombre_clients' => '+8'
    ];
    
    return $variations[$type] ?? '+0';
}

?>
