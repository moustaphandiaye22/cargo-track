import { Cargaison } from "../entity/Cargaison";
import { Colis } from "../entity/Colis";
import { Coordonnee } from "../entity/Coordonnee";
import { InterfaceCargaison } from "./InterfaceCargaison";
import { Personne } from "../entity/Personne";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { TypeColis } from "../Enum/TypeColis";
import { EtatColis } from "../Enum/EtatColis";
import { Recu } from "../entity/Recu";
export declare class CargaisonService implements InterfaceCargaison {
    private type;
    private types;
    private cargaison;
    constructor(type: TypeCargaison);
    creerCargaison(): void;
    ajouterproduit(colis: Colis): Colis;
    calculerFrais(): number;
    nombreProduit(): number;
    sommeTotal(): number;
    getFraisParType(typeColis?: TypeColis): number;
    rechercherColis(code: string): Colis;
    rechecherCargaison(code: string, lieuDepart: Coordonnee, lieuArrive: Coordonnee, datedepart: Date, datedarrive: Date, type: TypeCargaison): Cargaison;
    enregistrerClient(personne: Personne): Personne;
    private genererCodeColis;
    fermerCargaison(): boolean;
    rouvrirCargaison(): boolean;
    recupererColis(code: string): boolean;
    marquerColisPerdu(code: string): boolean;
    archiverColis(code: string): boolean;
    annulerColis(code: string): boolean;
    changerEtatColis(code: string, nouvelEtat: EtatColis): boolean;
    genererRecu(colis: Colis, expediteur: Personne, destinataire: Personne): Recu;
    private genererNumeroRecu;
    private calculerMontantTotal;
    suivreColis(code: string): {
        etat: EtatColis | null;
        message: string;
    };
}
