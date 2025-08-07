import { Cargaison } from "./Cargaison";
import { EtatColis } from "../Enum/EtatColis";
import { TypeColis } from "../Enum/TypeColis";
import { Personne } from "./Personne";

export class Colis{
    private code!:string;
    private nombre!:number;
    private poids!:number;
    private prix!:number;
    private typeproduit!:TypeColis;
    private etat!:EtatColis;
    private expediteur!:Personne;
    private destinataire!:Personne;
    private cargaison!:Cargaison;
    private dateCreation!:Date;
    private dateArchivage!:Date;

    constructor(){
      
    }
    getCode():string{return this.code; };
    getNombre():number{return this.nombre; };
    getPoids():number{return this.poids; };
    getPrix():number{return this.prix; };
    getTypeproduit():TypeColis{return this.typeproduit; };
    getEtat():EtatColis{return this.etat; };
    getExpediteur():Personne{return this.expediteur; };
    getDestinataire():Personne{return this.destinataire; };
    getCargaison():Cargaison{return this.cargaison; };
    getDateCreation():Date{return this.dateCreation; };
    getDateArchivage():Date{return this.dateArchivage; };
    setCode(code:string):void{this.code=code; };
    setNombre(nombre:number):void{this.nombre=nombre; };
    setPoids(poids:number):void{this.poids=poids; };
    setPrix(prix:number):void{this.prix=prix; };
    setTypeproduit(typeproduit:TypeColis):void{this.typeproduit=typeproduit; };
    setEtat(etat:EtatColis):void{this.etat=etat; };
    setExpediteur(expediteur:Personne):void{this.expediteur=expediteur; };
    setDestinataire(destinataire:Personne):void{this.destinataire=destinataire; };
    setCargaison(cargaison:Cargaison):void{this.cargaison=cargaison; };
    setDateCreation(dateCreation:Date):void{this.dateCreation=dateCreation; };
    setDateArchivage(dateArchivage:Date):void{this.dateArchivage=dateArchivage; };

    

}
