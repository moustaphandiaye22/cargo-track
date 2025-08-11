export declare class RecuAPI {
    /**
     * Génère un reçu à partir des données JSON reçues
     * @param jsonData Les données du colis et de la cargaison
     * @returns string JSON du reçu généré
     */
    static genererRecuDepuisJSON(jsonData: string): string;
    /**
     * Valide un reçu à partir de son JSON
     * @param recuJSON Le JSON du reçu à valider
     * @returns string Résultat de la validation
     */
    static validerRecuJSON(recuJSON: string): string;
    /**
     * Génère un résumé du reçu
     * @param recuJSON Le JSON du reçu
     * @returns string Le résumé
     */
    static genererResumeJSON(recuJSON: string): string;
    private static convertStringToTypeColis;
    private static convertStringToEtatColis;
    private static convertStringToTypeCargaison;
}
