import { Personne } from "../entity/Personne";
import { TypePersonne } from "../Enum/TypePersonne";
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    statut: 'succès' | 'erreur';
    message?: string;
    user?: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        type: TypePersonne;
    };
    token?: string;
}
export declare class AuthService {
    private static users;
    private static usersFilePath;
    private static loadUsers;
    private static saveUsers;
    private static initializeDefaultUsers;
    private static hashPassword;
    private static generateToken;
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
    static getAllUsers(): Personne[];
}
