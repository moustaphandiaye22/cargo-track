"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
class CodeGenerator {
    /**
     * Génère un code de colis unique
     * @returns Code généré (ex: COL004)
     */
    static genererCodeColis() {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `COL${random}`;
    }
    /**
     * Génère un numéro de cargaison unique
     * @returns Numéro à 3 chiffres (ex: 123)
     */
    static genererNumeroCargaison() {
        return Math.floor(Math.random() * 900) + 100; // Entre 100 et 999
    }
    /**
     * Génère un code de reçu unique
     * @returns Code généré (ex: REC004)
     */
    static genererCodeRecu() {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC${random}`;
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=CodeGenerator.js.map