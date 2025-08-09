export class CodeGenerator {
    
   
    static genererCodeColis(): string {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `COL${random}`;
    }

    
    static genererNumeroCargaison(): number {
        return Math.floor(Math.random() * 900) + 100; // Entre 100 et 999
    }

 
    static genererCodeRecu(): string {
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC${random}`;
    }
}
