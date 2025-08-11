"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
class CodeGenerator {
    static genererCodeColis() {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `COL${random}`;
    }
    static genererNumeroCargaison() {
        return Math.floor(Math.random() * 900) + 100; // Entre 100 et 999
    }
    static genererCodeRecu() {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC${random}`;
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=CodeGenerator.js.map