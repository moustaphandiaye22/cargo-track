"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
const fs_1 = require("fs");
const CodeGenerator_1 = require("../service/CodeGenerator");
class DataManager {
    static async loadData() {
        try {
            const data = await fs_1.promises.readFile(this.DB_PATH, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            return { cargaisons: [], colis: [], personnes: [], reçus: [] };
        }
    }
    static async saveData(data) {
        try {
            await fs_1.promises.writeFile(this.DB_PATH, JSON.stringify(data, null, 2));
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }
    // Méthodes pour les cargaisons
    static async getAllCargaisons() {
        const data = await this.loadData();
        return data.cargaisons;
    }
    static async getCargaisonById(id) {
        const data = await this.loadData();
        return data.cargaisons.find(c => c.id === id) || null;
    }
    // Méthodes pour les colis
    static async getAllColis() {
        const data = await this.loadData();
        return data.colis;
    }
    static async getColisByCode(code) {
        const data = await this.loadData();
        return data.colis.find(c => c.code === code) || null;
    }
    static async updateColisEtat(code, nouvelEtat) {
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
    static async getAllPersonnes() {
        const data = await this.loadData();
        return data.personnes;
    }
    static async saveNewColis(colisData) {
        const data = await this.loadData();
        colisData.id = Math.max(...data.colis.map(c => c.id), 0) + 1;
        data.colis.push(colisData);
        return await this.saveData(data);
    }
    static async saveNewCargaison(cargaisonData) {
        const data = await this.loadData();
        cargaisonData.id = Math.max(...data.cargaisons.map(c => c.id), 0) + 1;
        cargaisonData.numero = CodeGenerator_1.CodeGenerator.genererNumeroCargaison();
        cargaisonData.dateCreation = new Date().toISOString().split('T')[0];
        data.cargaisons.push(cargaisonData);
        return await this.saveData(data);
    }
}
exports.DataManager = DataManager;
DataManager.DB_PATH = './back/data/database.json';
//# sourceMappingURL=DataManager.js.map