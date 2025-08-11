import { promises as fs } from 'fs';
import { CodeGenerator } from '../service/CodeGenerator';
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
    lieuDepart?: {nom: string};
    lieuArrive?: {nom: string};
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

export class DataManager {
    private static readonly DB_PATH = './back/data/database.json';

    static async loadData(): Promise<DatabaseData> {
        try {
            const data = await fs.readFile(this.DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            return { cargaisons: [], colis: [], personnes: [], reçus: [] };
        }
    }

    static async saveData(data: DatabaseData): Promise<boolean> {
        try {
            await fs.writeFile(this.DB_PATH, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    // Méthodes pour les cargaisons
    static async getAllCargaisons(): Promise<CargaisonData[]> {
        const data = await this.loadData();
        return data.cargaisons;
    }

    static async getCargaisonById(id: number): Promise<CargaisonData | null> {
        const data = await this.loadData();
        return data.cargaisons.find(c => c.id === id) || null;
    }

    // Méthodes pour les colis
    static async getAllColis(): Promise<ColisData[]> {
        const data = await this.loadData();
        return data.colis;
    }

    static async getColisByCode(code: string): Promise<ColisData | null> {
        const data = await this.loadData();
        return data.colis.find(c => c.code === code) || null;
    }

    static async updateColisEtat(code: string, nouvelEtat: EtatColis): Promise<boolean> {
        const data = await this.loadData();
        const colisIndex = data.colis.findIndex(c => c.code === code);
        
        if (colisIndex === -1) {
            return false;
        }

        data.colis[colisIndex].etat = nouvelEtat;
        
        if (nouvelEtat === EtatColis.ARCHIVE) {
            data.colis[colisIndex].dateArchivage = new Date().toISOString().split('T')[0];
        }

        return await this.saveData(data);
    }

    // Méthodes pour les personnes
    static async getAllPersonnes(): Promise<PersonneData[]> {
        const data = await this.loadData();
        return data.personnes;
    }

    static async saveNewColis(colisData: ColisData): Promise<boolean> {
        const data = await this.loadData();
        colisData.id = Math.max(...data.colis.map(c => c.id), 0) + 1;
        data.colis.push(colisData);
        return await this.saveData(data);
    }

    static async saveNewCargaison(cargaisonData: CargaisonData): Promise<boolean> {
        const data = await this.loadData();
        cargaisonData.id = Math.max(...data.cargaisons.map(c => c.id), 0) + 1;
        cargaisonData.numero = CodeGenerator.genererNumeroCargaison();
        cargaisonData.dateCreation = new Date().toISOString().split('T')[0];
        data.cargaisons.push(cargaisonData);
        return await this.saveData(data);
    }
}
