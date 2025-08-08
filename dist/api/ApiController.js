"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const CargaisonService_1 = require("../service/CargaisonService");
const DataManager_1 = require("../data/DataManager");
const TypeCargaison_1 = require("../Enum/TypeCargaison");
const Colis_1 = require("../entity/Colis");
class ApiController {
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
    // API pour créer une nouvelle cargaison
    static async creerCargaison(data) {
        try {
            const typeCargaison = data.type.toUpperCase();
            // Utiliser le service existant pour la logique métier
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            service.creerCargaison();
            // Sauvegarder dans le JSON
            const cargaisonData = {
                type: typeCargaison,
                etatGlobal: 'OUVERT',
                etatAvancement: 'EN_ATTENTE',
                poidsMax: data.capacite,
                lieuDepart: { nom: data.lieuDepart },
                lieuArrive: { nom: data.lieuArrive },
                dateDepart: data.dateDepart,
                dateArrive: data.dateArrive
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
    // API pour ajouter un colis
    static async ajouterColis(data) {
        try {
            const typeCargaison = data.typeCargaison.toUpperCase();
            const typeProduit = data.typeProduit.toUpperCase();
            // Utiliser le service existant pour la validation
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            const colis = new Colis_1.Colis();
            colis.setTypeproduit(typeProduit);
            colis.setPoids(data.poids);
            colis.setPrix(data.prix);
            // Appliquer la logique métier du service
            const result = service.ajouterproduit(colis);
            // Sauvegarder dans le JSON
            const colisData = {
                code: result.getCode(),
                nombre: 1,
                poids: data.poids,
                prix: data.prix,
                typeProduit: typeProduit,
                etat: 'EN_ATTENTE',
                expediteur: data.expediteur,
                destinataire: data.destinataire,
                dateCreation: new Date().toISOString().split('T')[0],
                cargaisonId: null
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
    // API pour obtenir toutes les cargaisons
    static async getAllCargaisons() {
        try {
            const cargaisons = await DataManager_1.DataManager.getAllCargaisons();
            return {
                statut: 'succès',
                data: cargaisons.map(c => ({
                    id: c.id,
                    numero: c.numero,
                    type: c.type,
                    etat: c.etatGlobal,
                    avancement: c.etatAvancement,
                    lieuDepart: c.lieuDepart?.nom || 'Non défini',
                    lieuArrive: c.lieuArrive?.nom || 'Non défini',
                    dateDepart: c.dateDepart,
                    dateArrive: c.dateArrive
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
    // API pour obtenir tous les colis
    static async getAllColis() {
        try {
            const colis = await DataManager_1.DataManager.getAllColis();
            return {
                statut: 'succès',
                data: colis.map(c => ({
                    id: c.id,
                    code: c.code,
                    typeProduit: c.typeProduit,
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
    // API pour changer l'état d'un colis
    static async changerEtatColis(code, nouvelEtat) {
        try {
            // Utiliser le service existant pour la logique métier
            const typeCargaison = TypeCargaison_1.TypeCargaison.MARITIME; // Par défaut
            const service = new CargaisonService_1.CargaisonService(typeCargaison);
            // Appliquer la logique métier
            const success = service.changerEtatColis(code, nouvelEtat);
            if (success) {
                // Sauvegarder dans le JSON
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