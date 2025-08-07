import { Colis } from "./Colis";
import { Personne } from "./Personne";

export class Recu{
    private numerorecu!:string;
    private dateEmission!:Date;
    private colis!:Colis;
    private expediteur!:Personne;
    private destinataire!:Personne;
    private montanttotal!:number;

    constructor(){}

    getNumerorecu():string{return this.numerorecu; };
    getDateEmission():Date{return this.dateEmission; };
    getColis():Colis{return this.colis; };
    getExpediteur():Personne{return this.expediteur; };
    getDestinataire():Personne{return this.destinataire; };
    getMontanttotal():number{return this.montanttotal; };
    setNumerorecu(numerorecu:string):void{this.numerorecu=numerorecu; };
    setDateEmission(dateEmission:Date):void{this.dateEmission=dateEmission; };
    setColis(colis:Colis):void{this.colis=colis; };
    setExpediteur(expediteur:Personne):void{this.expediteur=expediteur; };
    setDestinataire(destinataire:Personne):void{this.destinataire=destinataire; };
    setMontanttotal(montanttotal:number):void{this.montanttotal=montanttotal; };
}
