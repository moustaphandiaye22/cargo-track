import { InterfaceColis } from "./InterfaceColis";
import { Colis } from "../entity/Colis";

export class ColisService implements InterfaceColis{
    private colis: Colis;

    constructor(colis: Colis){
        this.colis = colis;
    }

    getInfo():string{
        return `Informations du colis: ${this.colis.getCode()}`;
    }
}
