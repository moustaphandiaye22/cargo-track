import { Cargaison } from "../entity/Cargaison";
import { Colis } from "../entity/Colis";
import { Coordonnee } from "../entity/Coordonnee";
import { Personne } from "../entity/Personne";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { TypeColis } from "../Enum/TypeColis";
export interface InterfaceCargaison {
    creerCargaison(): void;
    ajouterproduit(colis: Colis): Colis;
    calculerFrais(): number;
    nombreProduit(): number;
    sommeTotal(): number;
    getFraisParType(typeColis?: TypeColis): number;
    rechercherColis(code: string): Colis;
    rechecherCargaison(code: string | null, lieuDepart: Coordonnee, lieuArrive: Coordonnee, datedepart: Date, datedarrive: Date, type: TypeCargaison): Cargaison;
    enregistrerClient(personne: Personne): Personne;
    fermerCargaison(): boolean;
    rouvrirCargaison(): boolean;
    recupererColis(code: string): boolean;
    marquerColisPerdu(code: string): boolean;
    archiverColis(code: string): boolean;
    annulerColis(code: string): boolean;
}
