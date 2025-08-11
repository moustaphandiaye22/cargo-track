"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecuService = void 0;
const Recu_1 = require("../entity/Recu");
const Colis_1 = require("../entity/Colis");
const Personne_1 = require("../entity/Personne");
class RecuService {
    /**
     * Génère un reçu pour un colis créé
     * @param colis Le colis pour lequel générer le reçu
     * @returns Recu Le reçu généré
     */
    static genererRecu(colis) {
        const recu = new Recu_1.Recu();
        // Générer un numéro de reçu unique (format REC + 6 chiffres)
        const numeroRecu = "REC" + this.genererNumeroAleatoire(6);
        recu.setNumerorecu(numeroRecu);
        recu.setDateEmission(new Date());
        recu.setColis(colis);
        recu.setExpediteur(colis.getExpediteur());
        recu.setDestinataire(colis.getDestinataire());
        recu.setMontanttotal(colis.getPrix());
        return recu;
    }
    /**
     * Génère un numéro aléatoire de la longueur spécifiée
     * @param longueur Longueur du numéro à générer
     * @returns string Le numéro généré avec zéros de tête
     */
    static genererNumeroAleatoire(longueur) {
        const max = Math.pow(10, longueur) - 1;
        const numero = Math.floor(Math.random() * max);
        return numero.toString().padStart(longueur, '0');
    }
    /**
     * Convertit un reçu en format JSON pour la sauvegarde
     * @param recu Le reçu à convertir
     * @returns any L'objet JSON représentant le reçu
     */
    static recuVersJSON(recu) {
        const colis = recu.getColis();
        const cargaison = colis.getCargaison();
        return {
            numerorecu: recu.getNumerorecu(),
            dateEmission: recu.getDateEmission().toISOString(),
            colis: {
                code: colis.getCode(),
                nombre: colis.getNombre(),
                poids: colis.getPoids(),
                prix: colis.getPrix(),
                typeProduit: colis.getTypeproduit(),
                etat: colis.getEtat(),
                dateCreation: colis.getDateCreation().toISOString()
            },
            expediteur: {
                nom: recu.getExpediteur().getNom(),
                prenom: recu.getExpediteur().getPrenom(),
                telephone: recu.getExpediteur().getTelephone(),
                adresse: recu.getExpediteur().getAdresse()
            },
            destinataire: {
                nom: recu.getDestinataire().getNom(),
                prenom: recu.getDestinataire().getPrenom(),
                telephone: recu.getDestinataire().getTelephone(),
                adresse: recu.getDestinataire().getAdresse()
            },
            cargaison: cargaison ? {
                numero: cargaison.getNumero(),
                type: cargaison.getType(),
                dateDepart: cargaison.getDatedepart(),
                dateArrive: cargaison.getDatedarrive()
            } : null,
            montanttotal: recu.getMontanttotal(),
            informationsSupplementaires: {
                codesColis: [colis.getCode()],
                statutColis: colis.getEtat(),
                modeTransport: this.getTypeTransportLabel(cargaison?.getType())
            }
        };
    }
    /**
     * Crée un reçu à partir de données JSON
     * @param jsonData Les données JSON du reçu
     * @returns Recu Le reçu créé
     */
    static jsonVersRecu(jsonData) {
        const recu = new Recu_1.Recu();
        recu.setNumerorecu(jsonData.numerorecu);
        recu.setDateEmission(new Date(jsonData.dateEmission));
        recu.setMontanttotal(jsonData.montanttotal);
        // Créer les objets Colis, Expediteur et Destinataire
        const colis = new Colis_1.Colis();
        colis.setCode(jsonData.colis.code);
        colis.setNombre(jsonData.colis.nombre);
        colis.setPoids(jsonData.colis.poids);
        colis.setPrix(jsonData.colis.prix);
        colis.setTypeproduit(jsonData.colis.typeProduit);
        colis.setEtat(jsonData.colis.etat);
        colis.setDateCreation(new Date(jsonData.colis.dateCreation));
        const expediteur = new Personne_1.Personne();
        expediteur.setNom(jsonData.expediteur.nom);
        expediteur.setPrenom(jsonData.expediteur.prenom);
        expediteur.setTelephone(jsonData.expediteur.telephone);
        expediteur.setAdresse(jsonData.expediteur.adresse);
        const destinataire = new Personne_1.Personne();
        destinataire.setNom(jsonData.destinataire.nom);
        destinataire.setPrenom(jsonData.destinataire.prenom);
        destinataire.setTelephone(jsonData.destinataire.telephone);
        destinataire.setAdresse(jsonData.destinataire.adresse);
        colis.setExpediteur(expediteur);
        colis.setDestinataire(destinataire);
        recu.setColis(colis);
        recu.setExpediteur(expediteur);
        recu.setDestinataire(destinataire);
        return recu;
    }
    /**
     * Convertit le type de transport en libellé lisible
     * @param type Le type de transport
     * @returns string Le libellé du type de transport
     */
    static getTypeTransportLabel(type) {
        if (!type)
            return 'Non défini';
        switch (type.toString()) {
            case 'MARITIME':
                return 'Transport Maritime';
            case 'AERIENNE':
                return 'Transport Aérien';
            case 'ROUTIERE':
                return 'Transport Routier';
            default:
                return type.toString();
        }
    }
    /**
     * Valide les données d'un reçu
     * @param recu Le reçu à valider
     * @returns boolean True si le reçu est valide
     */
    static validerRecu(recu) {
        try {
            // Vérifications de base
            if (!recu.getNumerorecu() || recu.getNumerorecu().length === 0) {
                return false;
            }
            if (!recu.getDateEmission()) {
                return false;
            }
            if (!recu.getColis()) {
                return false;
            }
            if (!recu.getExpediteur() || !recu.getDestinataire()) {
                return false;
            }
            if (recu.getMontanttotal() <= 0) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Génère un résumé textuel du reçu
     * @param recu Le reçu
     * @returns string Le résumé du reçu
     */
    static genererResume(recu) {
        const colis = recu.getColis();
        const expediteur = recu.getExpediteur();
        const destinataire = recu.getDestinataire();
        return `Reçu ${recu.getNumerorecu()} - Colis ${colis.getCode()} ` +
            `de ${expediteur.getPrenom()} ${expediteur.getNom()} ` +
            `vers ${destinataire.getPrenom()} ${destinataire.getNom()} ` +
            `(${colis.getPoids()}kg, ${recu.getMontanttotal()} FCFA)`;
    }
}
exports.RecuService = RecuService;
//# sourceMappingURL=RecuService.js.map