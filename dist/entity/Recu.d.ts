import { Colis } from "./Colis";
import { Personne } from "./Personne";
export declare class Recu {
    private numerorecu;
    private dateEmission;
    private colis;
    private expediteur;
    private destinataire;
    private montanttotal;
    constructor();
    getNumerorecu(): string;
    getDateEmission(): Date;
    getColis(): Colis;
    getExpediteur(): Personne;
    getDestinataire(): Personne;
    getMontanttotal(): number;
    setNumerorecu(numerorecu: string): void;
    setDateEmission(dateEmission: Date): void;
    setColis(colis: Colis): void;
    setExpediteur(expediteur: Personne): void;
    setDestinataire(destinataire: Personne): void;
    setMontanttotal(montanttotal: number): void;
}
