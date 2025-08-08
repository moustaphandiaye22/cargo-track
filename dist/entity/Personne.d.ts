import { TypePersonne } from "../Enum/TypePersonne";
export declare class Personne {
    private id;
    private nom;
    private prenom;
    private email;
    private password;
    private adresse;
    private telephone;
    private type;
    constructor();
    getId(): number;
    getNom(): string;
    getPrenom(): string;
    getEmail(): string;
    getPassword(): string;
    getAdresse(): string;
    getTelephone(): string;
    getType(): TypePersonne;
    setId(id: number): void;
    setNom(nom: string): void;
    setPrenom(prenom: string): void;
    setEmail(email: string): void;
    setPassword(password: string): void;
    setAdresse(adresse: string): void;
    setTelephone(telephone: string): void;
    setType(type: TypePersonne): void;
}
