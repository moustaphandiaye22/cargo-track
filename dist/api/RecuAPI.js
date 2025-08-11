"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecuAPI = void 0;
const RecuService_1 = require("../service/RecuService");
const Colis_1 = require("../entity/Colis");
const Personne_1 = require("../entity/Personne");
const Cargaison_1 = require("../entity/Cargaison");
const TypeColis_1 = require("../Enum/TypeColis");
const EtatColis_1 = require("../Enum/EtatColis");
const TypeCargaison_1 = require("../Enum/TypeCargaison");
class RecuAPI {
    /**
     * Génère un reçu à partir des données JSON reçues
     * @param jsonData Les données du colis et de la cargaison
     * @returns string JSON du reçu généré
     */
    static genererRecuDepuisJSON(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            // Créer l'expéditeur
            const expediteur = new Personne_1.Personne();
            expediteur.setNom(data.expediteur.nom);
            expediteur.setPrenom(data.expediteur.prenom);
            expediteur.setTelephone(data.expediteur.telephone);
            expediteur.setAdresse(data.expediteur.adresse);
            // Créer le destinataire
            const destinataire = new Personne_1.Personne();
            destinataire.setNom(data.destinataire.nom);
            destinataire.setPrenom(data.destinataire.prenom);
            destinataire.setTelephone(data.destinataire.telephone);
            destinataire.setAdresse(data.destinataire.adresse);
            // Créer la cargaison
            const cargaison = new Cargaison_1.Cargaison();
            cargaison.setNumero(data.cargaison.numero);
            cargaison.setType(this.convertStringToTypeCargaison(data.cargaison.type));
            cargaison.setDatedepart(new Date(data.cargaison.dateDepart));
            cargaison.setDatedarrive(new Date(data.cargaison.dateArrive));
            // Créer le colis
            const colis = new Colis_1.Colis();
            colis.setCode(data.colis.code);
            colis.setNombre(data.colis.nombre);
            colis.setPoids(data.colis.poids);
            colis.setPrix(data.colis.prix);
            colis.setTypeproduit(this.convertStringToTypeColis(data.colis.typeProduit));
            colis.setEtat(this.convertStringToEtatColis(data.colis.etat));
            colis.setDateCreation(new Date(data.colis.dateCreation));
            colis.setExpediteur(expediteur);
            colis.setDestinataire(destinataire);
            colis.setCargaison(cargaison);
            // Générer le reçu
            const recu = RecuService_1.RecuService.genererRecu(colis);
            // Convertir en JSON
            const recuJSON = RecuService_1.RecuService.recuVersJSON(recu);
            return JSON.stringify({
                success: true,
                recu: recuJSON
            });
        }
        catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            });
        }
    }
    /**
     * Valide un reçu à partir de son JSON
     * @param recuJSON Le JSON du reçu à valider
     * @returns string Résultat de la validation
     */
    static validerRecuJSON(recuJSON) {
        try {
            const recuData = JSON.parse(recuJSON);
            const recu = RecuService_1.RecuService.jsonVersRecu(recuData);
            const estValide = RecuService_1.RecuService.validerRecu(recu);
            return JSON.stringify({
                success: true,
                valid: estValide
            });
        }
        catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur de validation'
            });
        }
    }
    /**
     * Génère un résumé du reçu
     * @param recuJSON Le JSON du reçu
     * @returns string Le résumé
     */
    static genererResumeJSON(recuJSON) {
        try {
            const recuData = JSON.parse(recuJSON);
            const recu = RecuService_1.RecuService.jsonVersRecu(recuData);
            const resume = RecuService_1.RecuService.genererResume(recu);
            return JSON.stringify({
                success: true,
                resume: resume
            });
        }
        catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur de génération du résumé'
            });
        }
    }
    // Méthodes utilitaires pour convertir les chaînes en enums
    static convertStringToTypeColis(type) {
        switch (type) {
            case 'ALIMENTAIRE': return TypeColis_1.TypeColis.ALIMENTAIRE;
            case 'CHIMIQUE': return TypeColis_1.TypeColis.CHIMIQUE;
            case 'FRAGILE': return TypeColis_1.TypeColis.FRAGILE;
            case 'INCASSABLE': return TypeColis_1.TypeColis.INCASSABLE;
            case 'MATERIEL': return TypeColis_1.TypeColis.MATERIEL;
            case 'AUTRES': return TypeColis_1.TypeColis.AUTRES;
            default: return TypeColis_1.TypeColis.AUTRES;
        }
    }
    static convertStringToEtatColis(etat) {
        switch (etat) {
            case 'EN_ATTENTE': return EtatColis_1.EtatColis.EN_ATTENTE;
            case 'EN_COURS': return EtatColis_1.EtatColis.EN_COURS;
            case 'ARRIVE': return EtatColis_1.EtatColis.ARRIVE;
            default: return EtatColis_1.EtatColis.EN_ATTENTE;
        }
    }
    static convertStringToTypeCargaison(type) {
        switch (type) {
            case 'MARITIME': return TypeCargaison_1.TypeCargaison.MARITIME;
            case 'AERIENNE': return TypeCargaison_1.TypeCargaison.AERIENNE;
            case 'ROUTIERE': return TypeCargaison_1.TypeCargaison.ROUTIERE;
            default: return TypeCargaison_1.TypeCargaison.ROUTIERE;
        }
    }
}
exports.RecuAPI = RecuAPI;
// Export pour utilisation en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RecuAPI };
}
// Si exécuté en ligne de commande, traiter les arguments
if (typeof process !== 'undefined' && process.argv && process.argv.length > 2) {
    const action = process.argv[2];
    const jsonData = process.argv[3];
    switch (action) {
        case 'generer':
            console.log(RecuAPI.genererRecuDepuisJSON(jsonData));
            break;
        case 'valider':
            console.log(RecuAPI.validerRecuJSON(jsonData));
            break;
        case 'resume':
            console.log(RecuAPI.genererResumeJSON(jsonData));
            break;
        default:
            console.log(JSON.stringify({
                success: false,
                error: 'Action non reconnue. Utilisez: generer, valider, ou resume'
            }));
    }
}
//# sourceMappingURL=RecuAPI.js.map