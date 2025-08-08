import { promises as fs } from 'fs';

interface DatabaseData {
    cargaisons: any[];
    colis: any[];
    personnes: any[];
    reçus: any[];
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
    static async getAllCargaisons(): Promise<any[]> {
        const data = await this.loadData();
        return data.cargaisons;
    }

    static async getCargaisonById(id: number): Promise<any | null> {
        const data = await this.loadData();
        return data.cargaisons.find(c => c.id === id) || null;
    }

    // Méthodes pour les colis
    static async getAllColis(): Promise<any[]> {
        const data = await this.loadData();
        return data.colis;
    }

    static async getColisByCode(code: string): Promise<any | null> {
        const data = await this.loadData();
        return data.colis.find(c => c.code === code) || null;
    }

    static async updateColisEtat(code: string, nouvelEtat: string): Promise<boolean> {
        const data = await this.loadData();
        const colisIndex = data.colis.findIndex(c => c.code === code);
        
        if (colisIndex === -1) {
            return false;
        }

        data.colis[colisIndex].etat = nouvelEtat;
        
        if (nouvelEtat === 'ARCHIVE') {
            data.colis[colisIndex].dateArchivage = new Date().toISOString().split('T')[0];
        }

        return await this.saveData(data);
    }

    // Méthodes pour les personnes
    static async getAllPersonnes(): Promise<any[]> {
        const data = await this.loadData();
        return data.personnes;
    }

    static async saveNewColis(colisData: any): Promise<boolean> {
        const data = await this.loadData();
        colisData.id = Math.max(...data.colis.map(c => c.id), 0) + 1;
        data.colis.push(colisData);
        return await this.saveData(data);
    }

    static async saveNewCargaison(cargaisonData: any): Promise<boolean> {
        const data = await this.loadData();
        cargaisonData.id = Math.max(...data.cargaisons.map(c => c.id), 0) + 1;
        cargaisonData.numero = Math.floor(Math.random() * 1000000);
        cargaisonData.dateCreation = new Date().toISOString().split('T')[0];
        data.cargaisons.push(cargaisonData);
        return await this.saveData(data);
    }
}
