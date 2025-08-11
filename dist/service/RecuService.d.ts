import { Recu } from "../entity/Recu";
import { Colis } from "../entity/Colis";
export declare class RecuService {
    /**
     * Génère un reçu pour un colis créé
     * @param colis Le colis pour lequel générer le reçu
     * @returns Recu Le reçu généré
     */
    static genererRecu(colis: Colis): Recu;
    /**
     * Génère un numéro aléatoire de la longueur spécifiée
     * @param longueur Longueur du numéro à générer
     * @returns string Le numéro généré avec zéros de tête
     */
    private static genererNumeroAleatoire;
    /**
     * Convertit un reçu en format JSON pour la sauvegarde
     * @param recu Le reçu à convertir
     * @returns any L'objet JSON représentant le reçu
     */
    static recuVersJSON(recu: Recu): any;
    /**
     * Crée un reçu à partir de données JSON
     * @param jsonData Les données JSON du reçu
     * @returns Recu Le reçu créé
     */
    static jsonVersRecu(jsonData: any): Recu;
    /**
     * Convertit le type de transport en libellé lisible
     * @param type Le type de transport
     * @returns string Le libellé du type de transport
     */
    private static getTypeTransportLabel;
    /**
     * Valide les données d'un reçu
     * @param recu Le reçu à valider
     * @returns boolean True si le reçu est valide
     */
    static validerRecu(recu: Recu): boolean;
    /**
     * Génère un résumé textuel du reçu
     * @param recu Le reçu
     * @returns string Le résumé du reçu
     */
    static genererResume(recu: Recu): string;
}
