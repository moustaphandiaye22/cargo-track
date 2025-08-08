import { Cargaison } from "../entity/Cargaison";
import { Colis } from "../entity/Colis";
import { Coordonnee } from "../entity/Coordonnee";
import { InterfaceCargaison } from "./InterfaceCargaison";
import { Personne } from "../entity/Personne";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { TypeColis } from "../Enum/TypeColis";
import { EtatGlobal } from "../Enum/EtatGlobal";
import { EtatAvancement } from "../Enum/EtatAvancement";
import { EtatColis } from "../Enum/EtatColis";
import { Recu } from "../entity/Recu";

export class CargaisonService  implements InterfaceCargaison{
    private type: TypeCargaison;
    private types!:TypeColis;
    private cargaison!: Cargaison;
    
    constructor(type: TypeCargaison){
        this.type = type;
        this.cargaison = new Cargaison();
    }


    creerCargaison(): void{
        try{
            this.cargaison = new Cargaison();
            this.cargaison.setType(this.type);
            this.cargaison.setEtatglobal(EtatGlobal.OUVERT);
            this.cargaison.setEtatAvancement(EtatAvancement.EN_ATTENTE);
            this.cargaison.setNumero(Math.floor(Math.random() * 1000000));
            console.log(`Cargaison ${this.type} créée avec succès`);
        }catch(error){
            console.error('Erreur lors de la création de la cargaison',error);
        }
    }

    ajouterproduit(colis:Colis):Colis{
        try{
            if(this.cargaison.getEtatglobal() === EtatGlobal.FERME){
                console.log("Erreur: La cargaison est fermée, impossible d'ajouter des produits!");
                return colis;
            }

            if(this.type === TypeCargaison.MARITIME && colis.getTypeproduit() === TypeColis.FRAGILE){
                console.log("Erreur: Les produits fragiles ne peuvent pas être transportés par cargaison maritime!");
                return colis;
            }
            if(this.type === TypeCargaison.AERIENNE && colis.getTypeproduit() === TypeColis.CHIMIQUE){
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison aérienne!");
                return colis;
            }
            if(this.type === TypeCargaison.ROUTIERE && colis.getTypeproduit() === TypeColis.CHIMIQUE){
                console.log("Erreur: Les produits chimiques ne peuvent pas être transportés par cargaison routière!");
                return colis;
            }
            
            colis.setCode(this.genererCodeColis());
            colis.setEtat(EtatColis.EN_ATTENTE);
            colis.setDateCreation(new Date());
            
            if(colis.getPrix() < 10000){
                colis.setPrix(10000);
            }
            
            if(this.cargaison && this.cargaison.getSesproduit()) {
                const produits = this.cargaison.getSesproduit();
                produits.push(colis);
                this.cargaison.setSesproduit(produits);
            }
            
            console.log('Produit ajouté avec succès');
            return colis;
        }catch(error){
            console.error('Erreur lors de l\'ajout du produit',error);
            return colis;
        }
    }

    calculerFrais():number{
        if(this.type===TypeCargaison.MARITIME){
            return 5000; 
        }else if(this.type===TypeCargaison.AERIENNE){
            return 10000; 
        }else if(this.type===TypeCargaison.ROUTIERE){
            return 10000; 
        }
        return 0;
    }

    nombreProduit():number{
        return this.cargaison?.getSesproduit()?.length || 0;
    }

    sommeTotal():number{
        let total = this.calculerFrais();
        if(this.cargaison && this.cargaison.getSesproduit()){
            for(const colis of this.cargaison.getSesproduit()){
                const fraisParkg = this.getFraisParType(colis.getTypeproduit());
                total += colis.getPrix() + fraisParkg * (this.cargaison.getDistance() || 0);
            }
        }
        return total;
    }

    getFraisParType(typeColis?: TypeColis):number{
        const typeAUtiliser = typeColis || this.types;
        
        if(this.type===TypeCargaison.MARITIME){
            switch(typeAUtiliser){
                case TypeColis.ALIMENTAIRE: return 90;
                case TypeColis.CHIMIQUE: return 500;
                case TypeColis.FRAGILE: return 400;
                case TypeColis.INCASSABLE: return 400;
                case TypeColis.MATERIEL: return 300;
                default: return 0;
            }
        }else if(this.type===TypeCargaison.AERIENNE){
            switch(typeAUtiliser){
                case TypeColis.ALIMENTAIRE: return 300;
                case TypeColis.CHIMIQUE: return 0; // Interdit
                case TypeColis.FRAGILE: return 100;
                case TypeColis.INCASSABLE: return 100;
                case TypeColis.MATERIEL: return 150;
                default: return 0;
            }
        }else if(this.type===TypeCargaison.ROUTIERE){
            switch(typeAUtiliser){
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

    rechercherColis(code:string):Colis{
        if(!code || code.trim() === ''){
            console.error('Code invalide');
            return new Colis();
        }
        
        if(this.cargaison && this.cargaison.getSesproduit()){
            const colis = this.cargaison.getSesproduit().find(c => c.getCode() === code);
            if(colis){
                return colis;
            }
        }
        
        console.log('Colis non trouvé');
        return new Colis();
    }

    rechecherCargaison(code:string,lieuDepart:Coordonnee,lieuArrive:Coordonnee,datedepart:Date,datedarrive:Date,type:TypeCargaison):Cargaison{
        if(this.cargaison) {
            let matches = true;
            
            if(code && code.trim() !== '' && this.cargaison.getNumero().toString() !== code) {
                matches = false;
            }
            
            if(type && this.cargaison.getType() !== type) {
                matches = false;
            }
            
            if(matches) {
                return this.cargaison;
            }
        }
        
        console.log('Aucune cargaison trouvée avec ces critères');
        return new Cargaison();
    }

    enregistrerClient(personne:Personne):Personne{
        return personne;
    }


    private genererCodeColis(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        const paddedRandom = ('000' + random).slice(-3);
        return `COL${timestamp}${paddedRandom}`;
    }

    fermerCargaison(): boolean {
        if(!this.cargaison) {
            console.log("Aucune cargaison à fermer");
            return false;
        }
        
        this.cargaison.setEtatglobal(EtatGlobal.FERME);
        console.log("Cargaison fermée avec succès");
        return true;
    }

    rouvrirCargaison(): boolean {
        if(!this.cargaison) {
            console.log("Aucune cargaison à rouvrir");
            return false;
        }
        
        if(this.cargaison.getEtatglobal() === EtatGlobal.FERME && 
           this.cargaison.getEtatAvancement() === EtatAvancement.EN_ATTENTE) {
            this.cargaison.setEtatglobal(EtatGlobal.OUVERT);
            console.log("Cargaison rouverte avec succès");
            return true;
        }
        
        console.log("Impossible de rouvrir: la cargaison doit être fermée et en attente");
        return false;
    }

    recupererColis(code: string): boolean {
        const colis = this.rechercherColis(code);
        if(colis && colis.getCode()) {
            colis.setEtat(EtatColis.RECUPERE);
            console.log(`Colis ${code} marqué comme récupéré`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }

    marquerColisPerdu(code: string): boolean {
        const colis = this.rechercherColis(code);
        if(colis && colis.getCode()) {
            colis.setEtat(EtatColis.PERDU);
            console.log(`Colis ${code} marqué comme perdu`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }

    archiverColis(code: string): boolean {
        const colis = this.rechercherColis(code);
        if(colis && colis.getCode()) {
            colis.setEtat(EtatColis.ARCHIVE);
            colis.setDateArchivage(new Date());
            console.log(`Colis ${code} archivé`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }

    annulerColis(code: string): boolean {
        if(this.cargaison.getEtatglobal() === EtatGlobal.FERME) {
            console.log("Impossible d'annuler: la cargaison est fermée");
            return false;
        }
        
        const colis = this.rechercherColis(code);
        if(colis && colis.getCode()) {
            colis.setEtat(EtatColis.ANNULE);
            console.log(`Colis ${code} annulé`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }

    changerEtatColis(code: string, nouvelEtat: EtatColis): boolean {
        const colis = this.rechercherColis(code);
        if(colis && colis.getCode()) {
            colis.setEtat(nouvelEtat);
            console.log(`État du colis ${code} changé vers ${nouvelEtat}`);
            return true;
        }
        console.log(`Colis ${code} non trouvé`);
        return false;
    }

    genererRecu(colis: Colis, expediteur: Personne, destinataire: Personne): Recu {
        const recu = new Recu();
        recu.setNumerorecu(this.genererNumeroRecu());
        recu.setColis(colis);
        recu.setExpediteur(expediteur);
        recu.setDestinataire(destinataire);
        recu.setMontanttotal(this.calculerMontantTotal(colis));
        console.log("Reçu généré pour le colis:", colis.getCode());
        return recu;
    }

    private genererNumeroRecu(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        const paddedRandom = ('000' + random).slice(-3);
        return `REC${timestamp}${paddedRandom}`;
    }

    private calculerMontantTotal(colis: Colis): number {
        const fraisBase = this.calculerFrais();
        const fraisParType = this.getFraisParType(colis.getTypeproduit());
        const distance = this.cargaison?.getDistance() || 0;
        return colis.getPrix() + fraisBase + (fraisParType * distance / 1000);
    }

    suivreColis(code: string): { etat: EtatColis | null, message: string } {
        const colis = this.rechercherColis(code);
        
        if(!colis || !colis.getCode()) {
            return { etat: null, message: "Code non trouvé ou colis annulé" };
        }
        
        const etat = colis.getEtat();
        let message = "";
        
        switch(etat) {
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
