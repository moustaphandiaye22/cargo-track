import { Cargaison } from "../entity/Cargaison";
import { Colis } from "../entity/Colis";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { TypeColis } from "../Enum/TypeColis";
import { EtatGlobal } from "../Enum/EtatGlobal";
import { EtatAvancement } from "../Enum/EtatAvancement";
import { EtatColis } from "../Enum/EtatColis";
import { Recu } from "../entity/Recu";
export class CargaisonService {
    constructor(type) {
        this.type = type;
        this.cargaison = new Cargaison();
    }
    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer)
            return;
        const alertDiv = document.createElement('div');
        const colors = {
            success: 'bg-green-100 border-green-500 text-green-700',
            error: 'bg-red-100 border-red-500 text-red-700',
            info: 'bg-blue-100 border-blue-500 text-blue-700'
        };
        alertDiv.className = `${colors[type]} border-l-4 p-4 mb-4 rounded shadow-lg max-w-sm`;
        alertDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-xl leading-none cursor-pointer">&times;</button>
            </div>
        `;
        alertContainer.appendChild(alertDiv);
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    creerCargaison() {
        try {
            this.cargaison = new Cargaison();
            this.cargaison.setType(this.type);
            this.cargaison.setEtatglobal(EtatGlobal.OUVERT);
            this.cargaison.setEtatAvancement(EtatAvancement.EN_ATTENTE);
            this.cargaison.setNumero(Math.floor(Math.random() * 1000000));
            console.log(`Cargaison ${this.type} créée avec succès`);
        }
        catch (error) {
            console.error('Erreur lors de la création de la cargaison', error);
        }
    }
    ajouterproduit(colis) {
        try {
            // Vérifier si la cargaison est fermée
            if (this.cargaison.getEtatglobal() === EtatGlobal.FERME) {
                console.log("Erreur: La cargaison est fermée, impossible d'ajouter des produits!");
                return colis;
            }
            // Vérifier les restrictions selon le type de cargaison
            if (this.type === TypeCargaison.MARITIME && colis.getTypeproduit() === TypeColis.FRAGILE) {
                console.log("Erreur: Les produits fragiles ne peuvent pas être transportés par cargaison maritime!");
                return colis;
            }
            if (this.type === TypeCargaison.AERIENNE && colis.getTypeproduit() === TypeColis.CHIMIQUE) {
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison aérienne!");
                return colis;
            }
            if (this.type === TypeCargaison.ROUTIERE && colis.getTypeproduit() === TypeColis.CHIMIQUE) {
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison routière!");
                return colis;
            }
            // Générer un code unique pour le colis
            colis.setCode(this.genererCodeColis());
            colis.setEtat(EtatColis.EN_ATTENTE);
            colis.setDateCreation(new Date());
            // Appliquer le prix minimum de 10,000
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
        if (this.type === TypeCargaison.MARITIME) {
            return 8000;
        }
        else if (this.type === TypeCargaison.AERIENNE) {
            return 15000;
        }
        else if (this.type === TypeCargaison.ROUTIERE) {
            return 12000;
        }
        return 0;
    }
    nombreProduit() {
        var _a, _b;
        return ((_b = (_a = this.cargaison) === null || _a === void 0 ? void 0 : _a.getSesproduit()) === null || _b === void 0 ? void 0 : _b.length) || 0;
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
        if (this.type === TypeCargaison.MARITIME) {
            switch (typeAUtiliser) {
                case TypeColis.ALIMENTAIRE: return 90;
                case TypeColis.CHIMIQUE: return 500;
                case TypeColis.FRAGILE: return 400;
                case TypeColis.INCASSABLE: return 400;
                case TypeColis.MATERIEL: return 300;
                default: return 0;
            }
        }
        else if (this.type === TypeCargaison.AERIENNE) {
            switch (typeAUtiliser) {
                case TypeColis.ALIMENTAIRE: return 300;
                case TypeColis.CHIMIQUE: return 0; // Interdit
                case TypeColis.FRAGILE: return 100;
                case TypeColis.INCASSABLE: return 100;
                case TypeColis.MATERIEL: return 150;
                default: return 0;
            }
        }
        else if (this.type === TypeCargaison.ROUTIERE) {
            switch (typeAUtiliser) {
                case TypeColis.ALIMENTAIRE: return 100;
                case TypeColis.CHIMIQUE: return 0; // Interdit
                case TypeColis.FRAGILE: return 200;
                case TypeColis.INCASSABLE: return 200;
                case TypeColis.MATERIEL: return 150;
                default: return 0;
            }
        }
        return 0;
    }
    rechercherColis(code) {
        if (!code || code.trim() === '') {
            console.error('Code invalide');
            return new Colis();
        }
        if (this.cargaison && this.cargaison.getSesproduit()) {
            const colis = this.cargaison.getSesproduit().find(c => c.getCode() === code);
            if (colis) {
                return colis;
            }
        }
        console.log('Colis non trouvé');
        return new Colis();
    }
    rechecherCargaison(code, lieuDepart, lieuArrive, datedepart, datedarrive, type) {
        // Recherche flexible permettant la recherche par critères multiples
        if (this.cargaison) {
            let matches = true;
            // Vérifier le code si fourni
            if (code && code.trim() !== '' && this.cargaison.getNumero().toString() !== code) {
                matches = false;
            }
            // Vérifier le type si fourni
            if (type && this.cargaison.getType() !== type) {
                matches = false;
            }
            // TODO: Ajouter vérifications pour les coordonnées et dates
            // Ces vérifications nécessiteraient des méthodes de comparaison appropriées
            if (matches) {
                return this.cargaison;
            }
        }
        console.log('Aucune cargaison trouvée avec ces critères');
        return new Cargaison();
    }
    enregistrerClient(personne) {
        return personne;
    }
    // Nouvelles méthodes pour la gestion complète
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
        this.cargaison.setEtatglobal(EtatGlobal.FERME);
        console.log("Cargaison fermée avec succès");
        return true;
    }
    rouvrirCargaison() {
        if (!this.cargaison) {
            console.log("Aucune cargaison à rouvrir");
            return false;
        }
        if (this.cargaison.getEtatglobal() === EtatGlobal.FERME &&
            this.cargaison.getEtatAvancement() === EtatAvancement.EN_ATTENTE) {
            this.cargaison.setEtatglobal(EtatGlobal.OUVERT);
            console.log("Cargaison rouverte avec succès");
            return true;
        }
        console.log("Impossible de rouvrir: la cargaison doit être fermée et en attente");
        return false;
    }
    recupererColis(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis.RECUPERE);
            console.log(`Colis ${code} marqué comme récupéré`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    marquerColisPerdu(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis.PERDU);
            console.log(`Colis ${code} marqué comme perdu`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    archiverColis(code) {
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis.ARCHIVE);
            colis.setDateArchivage(new Date());
            console.log(`Colis ${code} archivé`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }
    annulerColis(code) {
        if (this.cargaison.getEtatglobal() === EtatGlobal.FERME) {
            console.log("Impossible d'annuler: la cargaison est fermée");
            return false;
        }
        const colis = this.rechercherColis(code);
        if (colis && colis.getCode()) {
            colis.setEtat(EtatColis.ANNULE);
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
        const recu = new Recu();
        // Configuration du reçu avec les informations nécessaires
        console.log("Reçu généré pour le colis:", colis.getCode());
        return recu;
    }
    suivreColis(code) {
        const colis = this.rechercherColis(code);
        if (!colis || !colis.getCode()) {
            return { etat: null, message: "Code non trouvé ou colis annulé" };
        }
        const etat = colis.getEtat();
        let message = "";
        switch (etat) {
            case EtatColis.EN_ATTENTE:
                message = "Votre colis est en attente de traitement";
                break;
            case EtatColis.EN_COURS:
                message = "Votre colis est en cours de transport";
                break;
            case EtatColis.ARRIVE:
                message = "Votre colis est arrivé à destination";
                break;
            case EtatColis.RECUPERE:
                message = "Votre colis a été récupéré";
                break;
            case EtatColis.PERDU:
                message = "Votre colis est malheureusement perdu";
                break;
            case EtatColis.ARCHIVE:
                message = "Votre colis a été archivé";
                break;
            case EtatColis.ANNULE:
                message = "Code non trouvé ou colis annulé";
                break;
            default:
                message = "État du colis inconnu";
        }
        return { etat, message };
    }
}
