import { Recu } from "../entity/Recu";
import { Colis } from "../entity/Colis";
import { Personne } from "../entity/Personne";
import { Cargaison } from "../entity/Cargaison";
import { TypeCargaison } from "../Enum/TypeCargaison";
import { TypeColis } from "../Enum/TypeColis";
import { EtatColis } from "../Enum/EtatColis";

export class RecuService {
    
    /**
     * Génère un reçu pour un colis créé
     * @param colis Le colis pour lequel générer le reçu
     * @returns Recu Le reçu généré
     */
    public static genererRecu(colis: Colis): Recu {
        const recu = new Recu();
        
        // Générer un numéro de reçu unique (format REC + 6 chiffres)
        const numeroRecu = "REC" + this.genererNumeroAleatoire(6);
        
        recu.setNumerorecu(numeroRecu);
        recu.setDateEmission(new Date());
        recu.setColis(colis);
        recu.setExpediteur(colis.getExpediteur());
        recu.setDestinataire(colis.getDestinataire());
        recu.setMontanttotal(colis.getPrix());
        
        return recu;
    }
    
    /**
     * Génère un numéro aléatoire de la longueur spécifiée
     * @param longueur Longueur du numéro à générer
     * @returns string Le numéro généré avec zéros de tête
     */
    private static genererNumeroAleatoire(longueur: number): string {
        const max = Math.pow(10, longueur) - 1;
        const numero = Math.floor(Math.random() * max);
        return numero.toString().padStart(longueur, '0');
    }
    
    /**
     * Convertit un reçu en format JSON pour la sauvegarde
     * @param recu Le reçu à convertir
     * @returns object L'objet JSON représentant le reçu
     */
    public static recuVersJSON(recu: Recu): object {
        const colis = recu.getColis();
        const cargaison = colis.getCargaison();
        
        return {
            numerorecu: recu.getNumerorecu(),
            dateEmission: recu.getDateEmission().toISOString(),
            colis: {
                code: colis.getCode(),
                nombre: colis.getNombre(),
                poids: colis.getPoids(),
                prix: colis.getPrix(),
                typeProduit: colis.getTypeproduit(),
                etat: colis.getEtat(),
                dateCreation: colis.getDateCreation().toISOString()
            },
            expediteur: {
                nom: recu.getExpediteur().getNom(),
                prenom: recu.getExpediteur().getPrenom(),
                telephone: recu.getExpediteur().getTelephone(),
                adresse: recu.getExpediteur().getAdresse()
            },
            destinataire: {
                nom: recu.getDestinataire().getNom(),
                prenom: recu.getDestinataire().getPrenom(),
                telephone: recu.getDestinataire().getTelephone(),
                adresse: recu.getDestinataire().getAdresse()
            },
            cargaison: cargaison ? {
                numero: cargaison.getNumero(),
                type: cargaison.getType(),
                dateDepart: cargaison.getDatedepart(),
                dateArrive: cargaison.getDatedarrive()
            } : null,
            montanttotal: recu.getMontanttotal(),
            informationsSupplementaires: {
                codesColis: [colis.getCode()],
                statutColis: colis.getEtat(),
                modeTransport: this.getTypeTransportLabel(cargaison?.getType())
            }
        };
    }
    
    /**
     * Crée un reçu à partir de données JSON
     * @param jsonData Les données JSON du reçu
     * @returns Recu Le reçu créé
     */
    public static jsonVersRecu(jsonData: {
        numerorecu: string;
        dateEmission: string;
        montanttotal: number;
        colis: {
            code: string;
            nombre: number;
            poids: number;
            prix: number;
            typeProduit: string;
            etat: string;
            dateCreation: string;
        };
        expediteur: {
            nom: string;
            prenom: string;
            telephone: string;
            adresse: string;
        };
        destinataire: {
            nom: string;
            prenom: string;
            telephone: string;
            adresse: string;
        };
    }): Recu {
        const recu = new Recu();
        
        recu.setNumerorecu(jsonData.numerorecu);
        recu.setDateEmission(new Date(jsonData.dateEmission));
        recu.setMontanttotal(jsonData.montanttotal);
        
        // Créer les objets Colis, Expediteur et Destinataire
        const colis = new Colis();
        colis.setCode(jsonData.colis.code);
        colis.setNombre(jsonData.colis.nombre);
        colis.setPoids(jsonData.colis.poids);
        colis.setPrix(jsonData.colis.prix);
        colis.setTypeproduit(jsonData.colis.typeProduit as TypeColis);
        colis.setEtat(jsonData.colis.etat as EtatColis);
        colis.setDateCreation(new Date(jsonData.colis.dateCreation));
        
        const expediteur = new Personne();
        expediteur.setNom(jsonData.expediteur.nom);
        expediteur.setPrenom(jsonData.expediteur.prenom);
        expediteur.setTelephone(jsonData.expediteur.telephone);
        expediteur.setAdresse(jsonData.expediteur.adresse);
        
        const destinataire = new Personne();
        destinataire.setNom(jsonData.destinataire.nom);
        destinataire.setPrenom(jsonData.destinataire.prenom);
        destinataire.setTelephone(jsonData.destinataire.telephone);
        destinataire.setAdresse(jsonData.destinataire.adresse);
        
        colis.setExpediteur(expediteur);
        colis.setDestinataire(destinataire);
        
        recu.setColis(colis);
        recu.setExpediteur(expediteur);
        recu.setDestinataire(destinataire);
        
        return recu;
    }
    
    /**
     * Convertit le type de transport en libellé lisible
     * @param type Le type de transport
     * @returns string Le libellé du type de transport
     */
    private static getTypeTransportLabel(type: TypeCargaison | undefined): string {
        if (!type) return 'Non défini';
        
        switch (type.toString()) {
            case 'MARITIME':
                return 'Transport Maritime';
            case 'AERIENNE':
                return 'Transport Aérien';
            case 'ROUTIERE':
                return 'Transport Routier';
            default:
                return type.toString();
        }
    }
    
    /**
     * Valide les données d'un reçu
     * @param recu Le reçu à valider
     * @returns boolean True si le reçu est valide
     */
    public static validerRecu(recu: Recu): boolean {
        try {
            // Vérifications de base
            if (!recu.getNumerorecu() || recu.getNumerorecu().length === 0) {
                return false;
            }
            
            if (!recu.getDateEmission()) {
                return false;
            }
            
            if (!recu.getColis()) {
                return false;
            }
            
            if (!recu.getExpediteur() || !recu.getDestinataire()) {
                return false;
            }
            
            if (recu.getMontanttotal() <= 0) {
                return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Génère un résumé textuel du reçu
     * @param recu Le reçu
     * @returns string Le résumé du reçu
     */
    public static genererResume(recu: Recu): string {
        const colis = recu.getColis();
        const expediteur = recu.getExpediteur();
        const destinataire = recu.getDestinataire();
        
        return `Reçu ${recu.getNumerorecu()} - Colis ${colis.getCode()} ` +
               `de ${expediteur.getPrenom()} ${expediteur.getNom()} ` +
               `vers ${destinataire.getPrenom()} ${destinataire.getNom()} ` +
               `(${colis.getPoids()}kg, ${recu.getMontanttotal()} FCFA)`;
    }
}
