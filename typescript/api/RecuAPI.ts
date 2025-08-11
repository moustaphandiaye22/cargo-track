import { RecuService } from "../service/RecuService";
import { Colis } from "../entity/Colis";
import { Personne } from "../entity/Personne";
import { Cargaison } from "../entity/Cargaison";
import { TypeColis } from "../Enum/TypeColis";
import { EtatColis } from "../Enum/EtatColis";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { EtatAvancement } from "../Enum/EtatAvancement";
import { EtatGlobal } from "../Enum/EtatGlobal";

export class RecuAPI {
    
   
    public static genererRecuDepuisJSON(jsonData: string): string {
        try {
            const data = JSON.parse(jsonData);
            
            const expediteur = new Personne();
            expediteur.setNom(data.expediteur.nom);
            expediteur.setPrenom(data.expediteur.prenom);
            expediteur.setTelephone(data.expediteur.telephone);
            expediteur.setAdresse(data.expediteur.adresse);
            
            const destinataire = new Personne();
            destinataire.setNom(data.destinataire.nom);
            destinataire.setPrenom(data.destinataire.prenom);
            destinataire.setTelephone(data.destinataire.telephone);
            destinataire.setAdresse(data.destinataire.adresse);
            
            const cargaison = new Cargaison();
            cargaison.setNumero(data.cargaison.numero);
            cargaison.setType(this.convertStringToTypeCargaison(data.cargaison.type));
            cargaison.setDatedepart(new Date(data.cargaison.dateDepart));
            cargaison.setDatedarrive(new Date(data.cargaison.dateArrive));
            
            const colis = new Colis();
            colis.setCode(data.colis.code);
            colis.setNombre(data.colis.nombre);
            colis.setPoids(data.colis.poids);
            colis.setPrix(data.colis.prix);
            colis.setTypeproduit(this.convertStringToTypeColis(data.colis.typeProduit));
            colis.setEtat(this.convertStringToEtatColis(data.colis.etat));
            colis.setDateCreation(new Date(data.colis.dateCreation));
            colis.setExpediteur(expediteur);
            colis.setDestinataire(destinataire);
            colis.setCargaison(cargaison);
            
            const recu = RecuService.genererRecu(colis);
            
            const recuJSON = RecuService.recuVersJSON(recu);
            
            return JSON.stringify({
                success: true,
                recu: recuJSON
            });
            
        } catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            });
        }
    }
    
   
    public static validerRecuJSON(recuJSON: string): string {
        try {
            const recuData = JSON.parse(recuJSON);
            const recu = RecuService.jsonVersRecu(recuData);
            const estValide = RecuService.validerRecu(recu);
            
            return JSON.stringify({
                success: true,
                valid: estValide
            });
            
        } catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur de validation'
            });
        }
    }
    
    
    public static genererResumeJSON(recuJSON: string): string {
        try {
            const recuData = JSON.parse(recuJSON);
            const recu = RecuService.jsonVersRecu(recuData);
            const resume = RecuService.genererResume(recu);
            
            return JSON.stringify({
                success: true,
                resume: resume
            });
            
        } catch (error) {
            return JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Erreur de génération du résumé'
            });
        }
    }
    
    private static convertStringToTypeColis(type: string): TypeColis {
        switch (type) {
            case 'ALIMENTAIRE': return TypeColis.ALIMENTAIRE;
            case 'CHIMIQUE': return TypeColis.CHIMIQUE;
            case 'FRAGILE': return TypeColis.FRAGILE;
            case 'INCASSABLE': return TypeColis.INCASSABLE;
            case 'MATERIEL': return TypeColis.MATERIEL;
            case 'AUTRES': return TypeColis.AUTRES;
            default: return TypeColis.AUTRES;
        }
    }
    
    private static convertStringToEtatColis(etat: string): EtatColis {
        switch (etat) {
            case 'EN_ATTENTE': return EtatColis.EN_ATTENTE;
            case 'EN_COURS': return EtatColis.EN_COURS;
            case 'ARRIVE': return EtatColis.ARRIVE;
            default: return EtatColis.EN_ATTENTE;
        }
    }
    
    private static convertStringToTypeCargaison(type: string): TypeCargaison {
        switch (type) {
            case 'MARITIME': return TypeCargaison.MARITIME;
            case 'AERIENNE': return TypeCargaison.AERIENNE;
            case 'ROUTIERE': return TypeCargaison.ROUTIERE;
            default: return TypeCargaison.ROUTIERE;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RecuAPI };
}

if (typeof process !== 'undefined' && process.argv && process.argv.length > 2) {
    const action = process.argv[2];
    const jsonData = process.argv[3];
    
    switch (action) {
        case 'generer':
            console.log(RecuAPI.genererRecuDepuisJSON(jsonData));
            break;
        case 'valider':
            console.log(RecuAPI.validerRecuJSON(jsonData));
            break;
        case 'resume':
            console.log(RecuAPI.genererResumeJSON(jsonData));
            break;
        default:
            console.log(JSON.stringify({
                success: false,
                error: 'Action non reconnue. Utilisez: generer, valider, ou resume'
            }));
    }
}
