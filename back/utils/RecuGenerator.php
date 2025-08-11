<?php

/**
 * Générateur de reçus utilisant la logique TypeScript
 */
class RecuGenerator {
    
    private static $distPath;
    
    private static function initDistPath() {
        if (self::$distPath === null) {
            self::$distPath = dirname(__DIR__, 2) . '/dist';
        }
    }
    
    public static function genererRecu($colis, $cargaison) {
        self::initDistPath();
        
        $inputData = [
            'colis' => [
                'code' => $colis['code'],
                'nombre' => $colis['nombre'],
                'poids' => $colis['poids'],
                'prix' => $colis['prix'],
                'typeProduit' => $colis['typeProduit'],
                'etat' => $colis['etat'],
                'dateCreation' => $colis['dateCreation']
            ],
            'expediteur' => $colis['expediteur'],
            'destinataire' => $colis['destinataire'],
            'cargaison' => [
                'numero' => $cargaison['numero'],
                'type' => $cargaison['type'],
                'dateDepart' => $cargaison['dateDepart'],
                'dateArrive' => $cargaison['dateArrive']
            ]
        ];
        
        $jsonInput = json_encode($inputData);
        $jsonInput = escapeshellarg($jsonInput);
        
        $command = "node " . escapeshellarg(self::$distPath . "/api/RecuAPI.js") . " generer $jsonInput";
        $output = shell_exec($command);
        
        if ($output === null) {
            error_log("Erreur lors de l'exécution du générateur de reçu TypeScript");
            return null;
        }
        
        $result = json_decode(trim($output), true);
        
        if (!$result || !$result['success']) {
            error_log("Erreur dans la génération du reçu: " . ($result['error'] ?? 'Erreur inconnue'));
            return null;
        }
        
        return $result['recu'];
    }
    
   
    public static function sauvegarderRecu($recu) {
        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        
        if (!isset($data['recus'])) {
            $data['recus'] = [];
        }
        
        $data['recus'][] = $recu;
        
        return file_put_contents($dbPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }
    
  
    public static function getRecuParNumero($numeroRecu) {
        $dbPath = dirname(__DIR__) . '/data/database.json';
        $data = file_exists($dbPath) ? json_decode(file_get_contents($dbPath), true) : [];
        
        if (!isset($data['recus'])) {
            return null;
        }
        
        foreach ($data['recus'] as $recu) {
            if (isset($recu['numerorecu']) && $recu['numerorecu'] === $numeroRecu) {
                return $recu;
            }
        }
        
        return null;
    }
    
    public static function validerRecu($recu) {
        self::initDistPath();
        
        $jsonInput = escapeshellarg(json_encode($recu));
        $command = "node " . escapeshellarg(self::$distPath . "/api/RecuAPI.js") . " valider $jsonInput";
        $output = shell_exec($command);
        
        if ($output === null) {
            return false;
        }
        
        $result = json_decode(trim($output), true);
        return $result && $result['success'] && $result['valid'];
    }
    
    public static function genererResume($recu) {
        self::initDistPath();
        
        $jsonInput = escapeshellarg(json_encode($recu));
        $command = "node " . escapeshellarg(self::$distPath . "/api/RecuAPI.js") . " resume $jsonInput";
        $output = shell_exec($command);
        
        if ($output === null) {
            return "Erreur lors de la génération du résumé";
        }
        
        $result = json_decode(trim($output), true);
        return $result && $result['success'] ? $result['resume'] : "Erreur lors de la génération du résumé";
    }
    
   
    public static function genererHTMLRecu($recu) {
        ob_start();
        include dirname(__DIR__) . '/template/recu/recu_template.php';
        return ob_get_clean();
    }
}

