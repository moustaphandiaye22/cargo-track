import { Coordonnee } from "./Coordonnee";
export declare class Trajet {
    private lieuDepart;
    private lieuArrive;
    private distance;
    constructor(lieuDepart: Coordonnee, lieuArrive: Coordonnee);
    getLieuDepart(): Coordonnee;
    getLieuArrive(): Coordonnee;
    getDistance(): number;
    setDistance(distance: number): void;
    setLieuDepart(lieuDepart: Coordonnee): void;
    setLieuArrive(lieuArrive: Coordonnee): void;
    calculDistance(): number;
}
