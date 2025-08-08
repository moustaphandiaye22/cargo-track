<?php

namespace App\Core;

class TypeScriptBridge
{
    private static string $nodeCommand = 'node';
    private static string $tsServerPath;

    public static function init(): void
    {
        self::$tsServerPath = dirname(__DIR__, 3) . '/dist/server.js';
    }

    /**
     * Exécuter une commande TypeScript et retourner le résultat
     */
    public static function execute(string $command, array $args = []): array
    {
        self::init();
        
        // Vérifier que le fichier compilé existe
        if (!file_exists(self::$tsServerPath)) {
            return [
                'statut' => 'erreur',
                'message' => 'Serveur TypeScript non compilé. Exécutez: npm run build'
            ];
        }

        // Construire la commande
        $cmd = self::$nodeCommand . ' ' . escapeshellarg(self::$tsServerPath) . ' ' . escapeshellarg($command);
        
        // Ajouter les arguments
        foreach ($args as $arg) {
            if (is_array($arg) || is_object($arg)) {
                $cmd .= ' ' . escapeshellarg(json_encode($arg));
            } else {
                $cmd .= ' ' . escapeshellarg($arg);
            }
        }

        // Exécuter la commande
        $output = [];
        $returnCode = 0;
        exec($cmd . ' 2>&1', $output, $returnCode);
        
        if ($returnCode !== 0) {
            return [
                'statut' => 'erreur',
                'message' => 'Erreur lors de l\'exécution: ' . implode('\n', $output)
            ];
        }

        // Décoder la réponse JSON
        $response = implode('\n', $output);
        $decoded = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                'statut' => 'erreur',
                'message' => 'Réponse invalide du serveur TypeScript: ' . $response
            ];
        }

        return $decoded;
    }

    /**
     * Méthodes spécifiques pour l'API
     */
    public static function suivreColis(string $code): array
    {
        return self::execute('suivi', [$code]);
    }

    public static function creerCargaison(array $data): array
    {
        return self::execute('creer-cargaison', [$data]);
    }

    public static function ajouterColis(array $data): array
    {
        return self::execute('ajouter-colis', [$data]);
    }

    public static function getAllCargaisons(): array
    {
        return self::execute('get-cargaisons');
    }

    public static function getAllColis(): array
    {
        return self::execute('get-colis');
    }

    public static function changerEtatColis(string $code, string $etat): array
    {
        return self::execute('changer-etat', [$code, $etat]);
    }

    /**
     * Vérifier si Node.js est disponible
     */
    public static function checkNodeJs(): array
    {
        $output = [];
        $returnCode = 0;
        exec('node --version 2>&1', $output, $returnCode);
        
        if ($returnCode !== 0) {
            return [
                'available' => false,
                'message' => 'Node.js non disponible'
            ];
        }

        return [
            'available' => true,
            'version' => trim($output[0] ?? 'Inconnu'),
            'ts_server' => file_exists(self::$tsServerPath)
        ];
    }
}
