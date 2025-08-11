import { TypePersonne } from "../Enum/TypePersonne";

export class Personne {
    private id!:number;
    private nom!:string;
    private prenom!:string;
    private email!:string;
    private password!:string;
    private adresse!:string;
    private telephone!:string;
    private type!:TypePersonne;

    constructor(){
      
    }
    getId():number{return this.id; };
    getNom():string{return this.nom; };
    getPrenom():string{return this.prenom; };
    getEmail():string{return this.email; };
    getPassword():string{return this.password; };
    getAdresse():string{return this.adresse; };
    getTelephone():string{return this.telephone; };
    getType():TypePersonne{return this.type; };
    setId(id:number):void{this.id=id; };
    setNom(nom:string):void{this.nom=nom; };
    setPrenom(prenom:string):void{this.prenom=prenom; };
    setEmail(email:string):void{this.email=email; };
    setPassword(password:string):void{this.password=password; };
    setAdresse(adresse:string):void{this.adresse=adresse; };
    setTelephone(telephone:string):void{this.telephone=telephone; };
    setType(type:TypePersonne):void{this.type=type; };
}
