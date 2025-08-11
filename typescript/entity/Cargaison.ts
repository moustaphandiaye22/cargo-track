import { Colis } from "./Colis";
import { EtatAvancement } from "../Enum/EtatAvancement";
import { EtatGlobal } from "../Enum/EtatGlobal";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { Coordonnee } from "./Coordonnee";
import { Trajet } from "./Trajet";


export class Cargaison{
    private id! :number;
    private numero!:number;
    private poidsMax!:number;
    private sesproduit!:Colis[];
    private prixtotal!:number;
    private distance!:number;
    private type!:TypeCargaison;
    private etatAvancement!:EtatAvancement;
    private etatglobal!:EtatGlobal;
    private trajet!:Trajet;
    private datedepart!:Date;
    private datedarrive!:Date;
    private coordonne!: Coordonnee;
    private readonly MAX_PRODUIT:number = 10;
    constructor(){
    }
    getId(){  return this.id; }
    getNumero(){  return this.numero; }
    getPoidsMax(){  return this.poidsMax; }
    getSesproduit(){  return this.sesproduit; }
    getPrixtotal(){  return this.prixtotal; }
    getDistance(){  return this.distance; }
    getType(){  return this.type; }
    getEtatAvancement(){  return this.etatAvancement; }
    getEtatglobal(){  return this.etatglobal; }
    getTrajet(){  return this.trajet; }
    getDatedepart(){  return this.datedepart; }
    getDatedarrive(){  return this.datedarrive; }
    getCoordonne(){  return this.coordonne; }
    setId(val:number){  this.id = val; }
    setNumero(val:number){  this.numero = val; }
    setPoidsMax(val:number){  this.poidsMax = val; }
    setSesproduit(val:Colis[]){  this.sesproduit = val; }
    setPrixtotal(val:number){  this.prixtotal = val; }
    setDistance(val:number){  this.distance = val; }
    setType(val:TypeCargaison){  this.type = val; }
    setEtatAvancement(val:EtatAvancement){  this.etatAvancement = val; }
    setEtatglobal(val:EtatGlobal){  this.etatglobal = val; }
    setTrajet(val:Trajet){  this.trajet = val; }
    setDatedepart(val:Date){  this.datedepart = val; }
    setDatedarrive(val:Date){  this.datedarrive = val; }
    setCoordonne(val:Coordonnee){  this.coordonne = val; }

        protected AjouterProduitbase(colis:Colis):boolean{
            if(!this.sesproduit){
                this.sesproduit = [];
            }
            if(this.sesproduit.length >= this.MAX_PRODUIT){
                console.log("La cargaison est pleine, elle ne peut pas dépasser 10 produits")
                return false;
            }
            this.sesproduit.push(colis);
            console.log('Produit ajouté avec succès');
            return true;
        }
}



