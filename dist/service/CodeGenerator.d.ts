export declare class CodeGenerator {
    /**
     * Génère un code de colis unique
     * @returns Code généré (ex: COL004)
     */
    static genererCodeColis(): string;
    /**
     * Génère un numéro de cargaison unique
     * @returns Numéro à 3 chiffres (ex: 123)
     */
    static genererNumeroCargaison(): number;
    /**
     * Génère un code de reçu unique
     * @returns Code généré (ex: REC004)
     */
    static genererCodeRecu(): string;
}
