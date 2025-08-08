interface DatabaseData {
    cargaisons: any[];
    colis: any[];
    personnes: any[];
    reçus: any[];
}
export declare class DataManager {
    private static readonly DB_PATH;
    static loadData(): Promise<DatabaseData>;
    static saveData(data: DatabaseData): Promise<boolean>;
    static getAllCargaisons(): Promise<any[]>;
    static getCargaisonById(id: number): Promise<any | null>;
    static getAllColis(): Promise<any[]>;
    static getColisByCode(code: string): Promise<any | null>;
    static updateColisEtat(code: string, nouvelEtat: string): Promise<boolean>;
    static getAllPersonnes(): Promise<any[]>;
    static saveNewColis(colisData: any): Promise<boolean>;
    static saveNewCargaison(cargaisonData: any): Promise<boolean>;
}
export {};
