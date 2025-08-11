<?php

class BusinessLogic 
{
   
    public static function validateProductTransport($typeCargaison, $typeProduit) 
    {
        if ($typeCargaison === 'MARITIME' && $typeProduit === 'FRAGILE') {
            return ['valid' => false, 'message' => 'Les produits fragiles ne peuvent pas être transportés par cargaison maritime'];
        }
        
        if ($typeCargaison === 'AERIENNE' && $typeProduit === 'CHIMIQUE') {
            return ['valid' => false, 'message' => 'Les produits chimiques ne peuvent pas être transportés par cargaison aérienne'];
        }
        
        if ($typeCargaison === 'ROUTIERE' && $typeProduit === 'CHIMIQUE') {
            return ['valid' => false, 'message' => 'Les produits chimiques ne peuvent pas être transportés par cargaison routière'];
        }
        
        return ['valid' => true, 'message' => ''];
    }

   
    public static function applyMinimumPrice($prix) 
    {
        return $prix < 10000 ? 10000 : $prix;
    }

  
    public static function calculateFees($typeCargaison, $typeProduit, $distance) 
    {
        $fraisBase = self::getBaseFees($typeCargaison);
        $fraisParKm = self::getFeesPerType($typeCargaison, $typeProduit);
        
        return $fraisBase + ($fraisParKm * $distance);
    }

    
    private static function getBaseFees($typeCargaison) 
    {
        switch ($typeCargaison) {
            case 'MARITIME':
                return 5000;
            case 'AERIENNE':
            case 'ROUTIERE':
                return 10000;
            default:
                return 0;
        }
    }

  
    private static function getFeesPerType($typeCargaison, $typeProduit) 
    {
        if ($typeCargaison === 'MARITIME') {
            switch ($typeProduit) {
                case 'ALIMENTAIRE': return 90;
                case 'CHIMIQUE': return 500;
                case 'FRAGILE': return 400;
                case 'INCASSABLE': return 400;
                case 'MATERIEL': return 300;
                default: return 0;
            }
        } elseif ($typeCargaison === 'AERIENNE') {
            switch ($typeProduit) {
                case 'ALIMENTAIRE': return 300;
                case 'CHIMIQUE': return 0; // Interdit
                case 'FRAGILE': return 100;
                case 'INCASSABLE': return 100;
                case 'MATERIEL': return 150;
                default: return 0;
            }
        } elseif ($typeCargaison === 'ROUTIERE') {
            switch ($typeProduit) {
                case 'ALIMENTAIRE': return 100;
                case 'CHIMIQUE': return 0; // Interdit
                case 'FRAGILE': return 200;
                case 'INCASSABLE': return 200;
                case 'MATERIEL': return 150;
                default: return 0;
            }
        }
        
        return 0;
    }

   
    public static function canAddPackageToShipment($cargaison) 
    {
        if (!$cargaison) {
            return ['valid' => false, 'message' => 'Cargaison non trouvée'];
        }
        
        if ($cargaison['etatGlobal'] === 'FERME') {
            return ['valid' => false, 'message' => 'La cargaison est fermée, impossible d\'ajouter des produits'];
        }
        
        return ['valid' => true, 'message' => ''];
    }
}
