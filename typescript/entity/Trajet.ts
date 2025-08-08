import { Coordonnee } from "./Coordonnee";

export class Trajet{

    private lieuDepart:Coordonnee;
    private lieuArrive:Coordonnee;
    private distance!:number;

    constructor( lieuDepart:Coordonnee, lieuArrive:Coordonnee){
        this.lieuDepart = lieuDepart;
        this.lieuArrive = lieuArrive;
        this.distance = this.calculDistance();

    }
    getLieuDepart():Coordonnee{return this.lieuDepart; };
    getLieuArrive():Coordonnee{return this.lieuArrive; };
    getDistance():number{return this.distance; };
    setDistance(distance:number):void{this.distance=distance; };
    setLieuDepart(lieuDepart:Coordonnee):void{this.lieuDepart=lieuDepart; };
    setLieuArrive(lieuArrive:Coordonnee):void{this.lieuArrive=lieuArrive; };

    calculDistance():number{
        return this.lieuDepart.distance(this.lieuArrive);
    }
  
}
