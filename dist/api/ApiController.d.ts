import { TypePersonne } from '../Enum/TypePersonne';
import { LoginRequest, AuthResponse } from '../service/AuthService';
export declare class ApiController {
    static login(credentials: LoginRequest): Promise<AuthResponse>;
    static validateToken(token: string): Promise<AuthResponse>;
    static logout(): Promise<AuthResponse>;
    static createUser(userData: {
        nom: string;
        prenom: string;
        email: string;
        password: string;
        type: TypePersonne;
        adresse: string;
        telephone: string;
    }): Promise<AuthResponse>;
    static suivreColis(code: string): Promise<{
        statut: string;
        data?: object;
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
        data?: object;
        message?: string;
    }>;
    static ajouterColis(data: {
        typeProduit: string;
        poids: number;
        prix: number;
        expediteur: {
            nom: string;
            prenom: string;
            telephone: string;
            adresse: string;
            email: string;
            password: string;
            type: TypePersonne;
        };
        destinataire: {
            nom: string;
            prenom: string;
            telephone: string;
            adresse: string;
            email: string;
            password: string;
            type: TypePersonne;
        };
        typeCargaison: string;
    }): Promise<{
        statut: string;
        data?: object;
        message?: string;
    }>;
    static getAllCargaisons(): Promise<{
        statut: string;
        data?: object[];
        message?: string;
    }>;
    static getAllColis(): Promise<{
        statut: string;
        data?: object[];
        message?: string;
    }>;
    static changerEtatColis(code: string, nouvelEtat: string): Promise<{
        statut: string;
        message?: string;
    }>;
    private static getMessageEtat;
}
