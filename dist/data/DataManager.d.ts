import { EtatColis } from '../Enum/EtatColis';
import { TypeColis } from '../Enum/TypeColis';
import { TypePersonne } from '../Enum/TypePersonne';
import { TypeCargaison } from '../Enum/TypeCargaison';
import { EtatAvancement } from '../Enum/EtatAvancement';
import { EtatGlobal } from '../Enum/EtatGlobal';
interface PersonneData {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    adresse: string;
    telephone: string;
    type: TypePersonne;
}
interface ColisData {
    id: number;
    code: string;
    nombre: number;
    poids: number;
    prix: number;
    typeproduit: TypeColis;
    etat: EtatColis;
    expediteur: PersonneData;
    destinataire: PersonneData;
    dateCreation: string;
    dateArchivage?: string;
    cargaisonId?: number;
}
interface CargaisonData {
    id: number;
    numero: number;
    poidsMax: number;
    prixtotal: number;
    distance: number;
    type: TypeCargaison;
    etatAvancement: EtatAvancement;
    etatglobal: EtatGlobal;
    datedepart: string;
    datedarrive: string;
    dateCreation: string;
    lieuDepart?: {
        nom: string;
    };
    lieuArrive?: {
        nom: string;
    };
}
interface RecuData {
    numerorecu: string;
    dateEmission: string;
    colis: ColisData;
    expediteur: PersonneData;
    destinataire: PersonneData;
    montanttotal: number;
}
interface DatabaseData {
    cargaisons: CargaisonData[];
    colis: ColisData[];
    personnes: PersonneData[];
    reçus: RecuData[];
}
export declare class DataManager {
    private static readonly DB_PATH;
    static loadData(): Promise<DatabaseData>;
    static saveData(data: DatabaseData): Promise<boolean>;
    static getAllCargaisons(): Promise<CargaisonData[]>;
    static getCargaisonById(id: number): Promise<CargaisonData | null>;
    static getAllColis(): Promise<ColisData[]>;
    static getColisByCode(code: string): Promise<ColisData | null>;
    static updateColisEtat(code: string, nouvelEtat: EtatColis): Promise<boolean>;
    static getAllPersonnes(): Promise<PersonneData[]>;
    static saveNewColis(colisData: ColisData): Promise<boolean>;
    static saveNewCargaison(cargaisonData: CargaisonData): Promise<boolean>;
}
export {};
