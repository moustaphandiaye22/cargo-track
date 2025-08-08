"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargaisonService = void 0;
const Cargaison_1 = require("../entity/Cargaison");
const Colis_1 = require("../entity/Colis");
const TypeCargaison_1 = require("../Enum/TypeCargaison");
const TypeColis_1 = require("../Enum/TypeColis");
const EtatGlobal_1 = require("../Enum/EtatGlobal");
const EtatAvancement_1 = require("../Enum/EtatAvancement");
const EtatColis_1 = require("../Enum/EtatColis");
const Recu_1 = require("../entity/Recu");
class CargaisonService {
    constructor(type) {
        this.type = type;
        this.cargaison = new Cargaison_1.Cargaison();
    }
    creerCargaison() {
        try {
            this.cargaison = new Cargaison_1.Cargaison();
            this.cargaison.setType(this.type);
            this.cargaison.setEtatglobal(EtatGlobal_1.EtatGlobal.OUVERT);
            this.cargaison.setEtatAvancement(EtatAvancement_1.EtatAvancement.EN_ATTENTE);
            this.cargaison.setNumero(Math.floor(Math.random() * 1000000));
            console.log(`Cargaison ${this.type} créée avec succès`);
        }
        catch (error) {
            console.error('Erreur lors de la création de la cargaison', error);
        }
    }
    ajouterproduit(colis) {
        try {
            if (this.cargaison.getEtatglobal() === EtatGlobal_1.EtatGlobal.FERME) {
                console.log("Erreur: La cargaison est fermée, impossible d'ajouter des produits!");
                return colis;
            }
            if (this.type === TypeCargaison_1.TypeCargaison.MARITIME && colis.getTypeproduit() === TypeColis_1.TypeColis.FRAGILE) {
                console.log("Erreur: Les produits fragiles ne peuvent pas être transportés par cargaison maritime!");
                return colis;
            }
            if (this.type === TypeCargaison_1.TypeCargaison.AERIENNE && colis.getTypeproduit() === TypeColis_1.TypeColis.CHIMIQUE) {
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison aérienne!");
                return colis;
            }
            if (this.type === TypeCargaison_1.TypeCargaison.ROUTIERE && colis.getTypeproduit() === TypeColis_1.TypeColis.CHIMIQUE) {
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison routière!");
                return colis;
            }
            colis.setCode(this.genererCodeColis());
            colis.setEtat(EtatColis_1.EtatColis.EN_ATTENTE);
            colis.setDateCreation(new Date());
            if (colis.getPrix() < 10000) {
                colis.setPrix(10000);
            }
            if (this.cargaison && this.cargaison.getSesproduit()) {
                const produits = this.cargaison.getSesproduit();
                produits.push(colis);
                this.cargaison.setSesproduit(produits);
            }
            console.log('Produit ajouté avec succès');
            return colis;
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du produit', error);
            return colis;
        }
    }
    calculerFrais() {
        if (this.type === TypeCargaison_1.TypeCargaison.MARITIME) {
            return 5000;
        }
        else if (this.type === TypeCargaison_1.TypeCargaison.AERIENNE) {
            return 10000;
        }
        else if (this.type === TypeCargaison_1.TypeCargaison.ROUTIERE) {
            return 10000;
        }
        return 0;
    }
    nombreProduit() {
        return this.cargaison?.getSesproduit()?.length || 0;
    }
    sommeTotal() {
        let total = this.calculerFrais();
        if (this.cargaison && this.cargaison.getSesproduit()) {
            for (const colis of this.cargaison.getSesproduit()) {
                const fraisParkg = this.getFraisParType(colis.getTypeproduit());
                total += colis.getPrix() + fraisParkg * (this.cargaison.getDistance() || 0);
            }
        }
        return total;
    }
    getFraisParType(typeColis) {
        const typeAUtiliser = typeColis || this.types;
        if (this.type === TypeCargaison_1.TypeCargaison.MARITIME) {
            switch (typeAUtiliser) {
                case TypeColis_1.TypeColis.ALIMENTAIRE: return 90;
                case TypeColis_1.TypeColis.CHIMIQUE: return 500;
                case TypeColis_1.TypeColis.FRAGILE: return 400;
                case TypeColis_1.TypeColis.INCASSABLE: return 400;
                case TypeColis_1.TypeColis.MATERIEL: return 300;
                default: return 0;
            }
        }
        else if (this.type === TypeCargaison_1.TypeCargaison.AERIENNE) {
            switch (typeAUtiliser) {
                case TypeColis_1.TypeColis.ALIMENTAIRE: return 300;
                case TypeColis_1.TypeColis.CHIMIQUE: return 0; // Interdit
                case TypeColis_1.TypeColis.FRAGILE: return 100;
                case TypeColis_1.TypeColis.INCASSABLE: return 100;
                case TypeColis_1.TypeColis.MATERIEL: return 150;
                default: return 0;
            }
        }
        else if (this.type === TypeCargaison_1.TypeCargaison.ROUTIERE) {
            switch (typeAUtiliser) {
                case TypeColis_1.TypeColis.ALIMENTAIRE: return 100;
                case TypeColis_1.TypeColis.CHIMIQUE: return 0; // Interdit
                case TypeColis_1.TypeColis.FRAGILE: return 200;
                case TypeColis_1.TypeColis.INCASSABLE: return 200;
                case TypeColis_1.TypeColis.MATERIEL: return 150;
                default: return 0;
            }
        }
        return 0;
    }
    rechercherColis(code) {
        if (!code || code.trim() === '') {
            console.error('Code invalide');
            return new Colis_1.Colis();
        }
        if (this.cargaison && this.cargaison.getSesproduit()) {
            const colis = this.cargaison.getSesproduit().find(c => c.getCode() === code);
            if (colis) {
                return colis;
            }
        }
        console.log('Colis non trouvé');
        return new Colis_1.Colis();
    }
    rechecherCargaison(code, lieuDepart, lieuArrive, datedepart, datedarrive, type) {
        if (this.cargaison) {
            let matches = true;
            if (code && code.trim() !== '' && this.cargaison.getNumero().toString() !== code) {
                matches = false;
            }
            if (type && this.cargaison.getType() !== type) {
                matches = false;
            }
            if (matches) {
                return this.cargaison;
            }
        }
        console.log('Aucune cargaison trouvée avec ces critères');
        return new Cargaison_1.Cargaison();
    }
    enregistrerClient(personne) {
        return personne;
    }
    genererCodeColis() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        const paddedRandom = ('000' + random).slice(-3);
        return `COL${timestamp}${paddedRandom}`;
    }
    fermerCargaison() {
        if (!this.cargaison) {
            console.log("Aucune cargaison à fermer");
            return false;
        }
        this.cargaison.setEtatglobal(EtatGlobal_1.EtatGlobal.FERME);
        console.log("Cargaison fermée avec succès");
        return true;
    }
    rouvrirCargaison() {
        if (!this.cargaison) {
            console.log("Aucune cargaison à rouvrir");
            return false;
        }
        if (this.cargaison.getEtatglobal() === EtatGlobal_1.EtatGlobal.FERME &&
            this.cargaison.getEtatAvancement() === EtatAvancement_1.EtatAvancement.EN_ATTENTE) {
            this.cargaison.setEtatglobal(EtatGlobal_1.EtatGlobal.OUVERT);
            console.log("Cargaison rouverte avec succès");
            return true;
        }
        console.log("Impossible de rouvrir: la cargaison doit être fermée et en attente");
        return false;
    }
    recupererColis(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis_1.EtatColis.RECUPERE);
            console.log(`Colis ${code} marqué comme récupéré`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    marquerColisPerdu(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis_1.EtatColis.PERDU);
            console.log(`Colis ${code} marqué comme perdu`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    archiverColis(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis_1.EtatColis.ARCHIVE);
            colis.setDateArchivage(new Date());
            console.log(`Colis ${code} archivé`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    annulerColis(code) {
        if (this.cargaison.getEtatglobal() === EtatGlobal_1.EtatGlobal.FERME) {
            console.log("Impossible d'annuler: la cargaison est fermée");
            return false;
        }
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis_1.EtatColis.ANNULE);
            console.log(`Colis ${code} annulé`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    changerEtatColis(code, nouvelEtat) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(nouvelEtat);
            console.log(`État du colis ${code} changé vers ${nouvelEtat}`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    genererRecu(colis, expediteur, destinataire) {
        const recu = new Recu_1.Recu();
        recu.setNumerorecu(this.genererNumeroRecu());
        recu.setColis(colis);
        recu.setExpediteur(expediteur);
        recu.setDestinataire(destinataire);
        recu.setMontanttotal(this.calculerMontantTotal(colis));
        console.log("Reçu généré pour le colis:", colis.getCode());
        return recu;
    }
    genererNumeroRecu() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        const paddedRandom = ('000' + random).slice(-3);
        return `REC${timestamp}${paddedRandom}`;
    }
    calculerMontantTotal(colis) {
        const fraisBase = this.calculerFrais();
        const fraisParType = this.getFraisParType(colis.getTypeproduit());
        const distance = this.cargaison?.getDistance() || 0;
        return colis.getPrix() + fraisBase + (fraisParType * distance / 1000);
    }
    suivreColis(code) {
        const colis = this.rechercherColis(code);
        if (!colis || !colis.getCode()) {
            return { etat: null, message: "Code non trouvé ou colis annulé" };
        }
        const etat = colis.getEtat();
        let message = "";
        switch (etat) {
            case EtatColis_1.EtatColis.EN_ATTENTE:
                message = "Votre colis est en attente de traitement";
                break;
            case EtatColis_1.EtatColis.EN_COURS:
                message = "Votre colis est en cours de transport";
                break;
            case EtatColis_1.EtatColis.ARRIVE:
                message = "Votre colis est arrivé à destination";
                break;
            case EtatColis_1.EtatColis.RECUPERE:
                message = "Votre colis a été récupéré";
                break;
            case EtatColis_1.EtatColis.PERDU:
                message = "Votre colis est malheureusement perdu";
                break;
            case EtatColis_1.EtatColis.ARCHIVE:
                message = "Votre colis a été archivé";
                break;
            case EtatColis_1.EtatColis.ANNULE:
                message = "Code non trouvé ou colis annulé";
                break;
            default:
                message = "État du colis inconnu";
        }
        return { etat, message };
    }
}
exports.CargaisonService = CargaisonService;
//# sourceMappingURL=CargaisonService.js.map