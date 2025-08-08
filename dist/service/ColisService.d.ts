import { InterfaceColis } from "./InterfaceColis";
import { Colis } from "../entity/Colis";
export declare class ColisService implements InterfaceColis {
    private colis;
    constructor(colis: Colis);
    getInfo(): string;
}
