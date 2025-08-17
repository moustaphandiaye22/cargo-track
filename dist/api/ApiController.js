"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const CargaisonService_1 = require("../service/CargaisonService");
const DataManager_1 = require("../data/DataManager");
const TypeCargaison_1 = require("../Enum/TypeCargaison");
const EtatGlobal_1 = require("../Enum/EtatGlobal");
const EtatAvancement_1 = require("../Enum/EtatAvancement");
const Colis_1 = require("../entity/Colis");
const AuthService_1 = require("../service/AuthService");
class ApiController {
    // API d'authentification
    static async login(credentials) {
        return await AuthService_1.AuthService.login(credentials);
    }
    static async validateToken(token) {
        return await AuthService_1.AuthService.validateToken(token);
    }
    static async logout() {
        return await AuthService_1.AuthService.logout();
    }
    static async createUser(userData) {
        return await AuthService_1.AuthService.createUser(userData);
    }
    // API pour le suivi des colis
    static async suivreColis(code) {
        try {
            const colisData = await DataManager_1.DataManager.getColisByCode(code);
            if (!colisData) {
                return {
                    statut: 'erreur',
                    message: 'Code de suivi non trouvé'
                };
            }
            const cargaisonData = colisData.cargaisonId ?
                await DataManager_1.DataManager.getCargaisonById(colisData.cargaisonId) : null;
            return {
                statut: 'succès',
                data: {
                    code: colisData.code,
                    etat: colisData.etat,
                    message: this.getMessageEtat(colisData.etat),
                    expediteur: `${colisData.expediteur.prenom} ${colisData.expediteur.nom}`.trim(),
                    destinataire: `${colisData.destinataire.prenom} ${colisData.destinataire.nom}`.trim(),
                    typeCargaison: cargaisonData?.type || 'Non assigné',
                    poids: `${colisData.poids} kg`,
                    prix: colisData.prix
                }
            };
        }
        catch (error) {
            console.error('Erreur lors du suivi:', error);
            return {
                statut: 'erreur',
                message: 'Erreur serveur lors du suivi'
            };
        }
    }
    static async creerCargaison(data) {
        try {
            const typeCargaison = data.type.toUpperCase();
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            service.creerCargaison();
            const cargaisonData = {
                id: 0, // sera assigné par DataManager
                numero: 0, // sera assigné par DataManager
                type: typeCargaison,
                etatglobal: EtatGlobal_1.EtatGlobal.OUVERT,
                etatAvancement: EtatAvancement_1.EtatAvancement.EN_ATTENTE,
                poidsMax: data.capacite,
                prixtotal: 0,
                distance: 0,
                lieuDepart: { nom: data.lieuDepart },
                lieuArrive: { nom: data.lieuArrive },
                datedepart: data.dateDepart,
                datedarrive: data.dateArrive,
                dateCreation: new Date().toISOString().split('T')[0]
            };
            const success = await DataManager_1.DataManager.saveNewCargaison(cargaisonData);
            if (success) {
                return {
                    statut: 'succès',
                    data: {
                        type: typeCargaison,
                        message: `Cargaison ${typeCargaison} créée avec succès`
                    }
                };
            }
            else {
                return {
                    statut: 'erreur',
                    message: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            console.error('Erreur lors de la création:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la création de la cargaison'
            };
        }
    }
    static async ajouterColis(data) {
        try {
            const typeCargaison = data.typeCargaison.toUpperCase();
            const typeProduit = data.typeProduit.toUpperCase();
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            const colis = new Colis_1.Colis();
            colis.setTypeproduit(typeProduit);
            colis.setPoids(data.poids);
            colis.setPrix(data.prix);
            const result = service.ajouterproduit(colis);
            const colisData = {
                id: 0, // sera assigné par DataManager
                code: result.getCode(),
                nombre: 1,
                poids: data.poids,
                prix: data.prix,
                typeproduit: typeProduit,
                etat: 'EN_ATTENTE',
                expediteur: {
                    id: 0,
                    ...data.expediteur
                },
                destinataire: {
                    id: 0,
                    ...data.destinataire
                },
                dateCreation: new Date().toISOString().split('T')[0],
                cargaisonId: undefined
            };
            const success = await DataManager_1.DataManager.saveNewColis(colisData);
            if (success) {
                return {
                    statut: 'succès',
                    data: {
                        code: result.getCode(),
                        message: 'Colis ajouté avec succès'
                    }
                };
            }
            else {
                return {
                    statut: 'erreur',
                    message: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de l\'ajout du colis'
            };
        }
    }
    static async getAllCargaisons() {
        try {
            const cargaisons = await DataManager_1.DataManager.getAllCargaisons();
            return {
                statut: 'succès',
                data: cargaisons.map(c => ({
                    id: c.id,
                    numero: c.numero,
                    type: c.type,
                    etat: c.etatglobal,
                    avancement: c.etatAvancement,
                    lieuDepart: c.lieuDepart?.nom || 'Non défini',
                    lieuArrive: c.lieuArrive?.nom || 'Non défini',
                    dateDepart: c.datedepart,
                    dateArrive: c.datedarrive
                }))
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la récupération des cargaisons'
            };
        }
    }
    static async getAllColis() {
        try {
            const colis = await DataManager_1.DataManager.getAllColis();
            return {
                statut: 'succès',
                data: colis.map(c => ({
                    id: c.id,
                    code: c.code,
                    typeProduit: c.typeproduit,
                    etat: c.etat,
                    poids: c.poids,
                    prix: c.prix,
                    expediteur: `${c.expediteur.prenom} ${c.expediteur.nom}`.trim(),
                    destinataire: `${c.destinataire.prenom} ${c.destinataire.nom}`.trim(),
                    dateCreation: c.dateCreation
                }))
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la récupération des colis'
            };
        }
    }
    static async changerEtatColis(code, nouvelEtat) {
        try {
            const typeCargaison = TypeCargaison_1.TypeCargaison.MARITIME;
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            const success = service.changerEtatColis(code, nouvelEtat);
            if (success) {
                await DataManager_1.DataManager.updateColisEtat(code, nouvelEtat.toUpperCase());
                return {
                    statut: 'succès',
                    message: `État du colis ${code} changé vers ${nouvelEtat}`
                };
            }
            else {
                return {
                    statut: 'erreur',
                    message: 'Colis non trouvé'
                };
            }
        }
        catch (error) {
            console.error('Erreur lors du changement d\'état:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors du changement d\'état'
            };
        }
    }
    static getMessageEtat(etat) {
        // Utilise la logique de CargaisonService pour éviter la duplication
        const service = new CargaisonService_1.CargaisonService(TypeCargaison_1.TypeCargaison.MARITIME);
        const result = service.suivreColis('dummy');
        const messages = {
            'EN_ATTENTE': 'Votre colis est en attente de traitement',
            'EN_COURS': 'Votre colis est en cours de transport',
            'ARRIVE': 'Votre colis est arrivé à destination',
            'RECUPERE': 'Votre colis a été récupéré',
            'PERDU': 'Votre colis est malheureusement perdu',
            'ARCHIVE': 'Votre colis a été archivé'
        };
        return messages[etat] || 'État inconnu';
    }
}
exports.ApiController = ApiController;
//# sourceMappingURL=ApiController.js.map