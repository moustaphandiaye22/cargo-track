export declare class ApiController {
    static suivreColis(code: string): Promise<{
        statut: string;
        data?: any;
        message?: string;
    }>;
    static creerCargaison(data: {
        type: string;
        capacite: number;
        lieuDepart: string;
        lieuArrive: string;
        dateDepart: string;
        dateArrive: string;
    }): Promise<{
        statut: string;
        data?: any;
        message?: string;
    }>;
    static ajouterColis(data: {
        typeProduit: string;
        poids: number;
        prix: number;
        expediteur: any;
        destinataire: any;
        typeCargaison: string;
    }): Promise<{
        statut: string;
        data?: any;
        message?: string;
    }>;
    static getAllCargaisons(): Promise<{
        statut: string;
        data?: any[];
        message?: string;
    }>;
    static getAllColis(): Promise<{
        statut: string;
        data?: any[];
        message?: string;
    }>;
    static changerEtatColis(code: string, nouvelEtat: string): Promise<{
        statut: string;
        message?: string;
    }>;
    private static getMessageEtat;
}
