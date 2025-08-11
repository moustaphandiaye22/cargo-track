import { CargaisonService } from '../service/CargaisonService';
import { DataManager } from '../data/DataManager';
import { TypeCargaison } from '../Enum/TypeCargaison';
import { TypeColis } from '../Enum/TypeColis';
import { EtatColis } from '../Enum/EtatColis';
import { TypePersonne } from '../Enum/TypePersonne';
import { EtatGlobal } from '../Enum/EtatGlobal';
import { EtatAvancement } from '../Enum/EtatAvancement';
import { Colis } from '../entity/Colis';
import { Personne } from '../entity/Personne';

export class ApiController {
    
    // API pour le suivi des colis
    static async suivreColis(code: string): Promise<{statut: string, data?: object, message?: string}> {
        try {
            const colisData = await DataManager.getColisByCode(code);
            
            if (!colisData) {
                return {
                    statut: 'erreur',
                    message: 'Code de suivi non trouvé'
                };
            }

            const cargaisonData = colisData.cargaisonId ? 
                await DataManager.getCargaisonById(colisData.cargaisonId) : null;

            return {
                statut: 'succès',
                data: {
                    code: colisData.code,
                    etat: colisData.etat,
                    message: this.getMessageEtat(colisData.etat),
                    expediteur: `${colisData.expediteur.prenom} ${colisData.expediteur.nom}`.trim(),
                    destinataire: `${colisData.destinataire.prenom} ${colisData.destinataire.nom}`.trim(),
                    typeCargaison: cargaisonData?.type || 'Non assigné',
                    poids: `${colisData.poids} kg`,
                    prix: colisData.prix
                }
            };
        } catch (error) {
            console.error('Erreur lors du suivi:', error);
            return {
                statut: 'erreur',
                message: 'Erreur serveur lors du suivi'
            };
        }
    }

    static async creerCargaison(data: {
        type: string,
        capacite: number,
        lieuDepart: string,
        lieuArrive: string,
        dateDepart: string,
        dateArrive: string
    }): Promise<{statut: string, data?: object, message?: string}> {
        try {
            const typeCargaison = data.type.toUpperCase() as TypeCargaison;
            
            const service = new CargaisonService(typeCargaison);
            service.creerCargaison();
            
            const cargaisonData = {
                id: 0, // sera assigné par DataManager
                numero: 0, // sera assigné par DataManager
                type: typeCargaison,
                etatglobal: EtatGlobal.OUVERT,
                etatAvancement: EtatAvancement.EN_ATTENTE,
                poidsMax: data.capacite,
                prixtotal: 0,
                distance: 0,
                lieuDepart: { nom: data.lieuDepart },
                lieuArrive: { nom: data.lieuArrive },
                datedepart: data.dateDepart,
                datedarrive: data.dateArrive,
                dateCreation: new Date().toISOString().split('T')[0]
            };
            
            const success = await DataManager.saveNewCargaison(cargaisonData);
            
            if (success) {
                return {
                    statut: 'succès',
                    data: {
                        type: typeCargaison,
                        message: `Cargaison ${typeCargaison} créée avec succès`
                    }
                };
            } else {
                return {
                    statut: 'erreur',
                    message: 'Erreur lors de la sauvegarde'
                };
            }
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la création de la cargaison'
            };
        }
    }

    static async ajouterColis(data: {
        typeProduit: string,
        poids: number,
        prix: number,
        expediteur: {nom: string, prenom: string, telephone: string, adresse: string, email: string, password: string, type: TypePersonne},
        destinataire: {nom: string, prenom: string, telephone: string, adresse: string, email: string, password: string, type: TypePersonne},
        typeCargaison: string
    }): Promise<{statut: string, data?: object, message?: string}> {
        try {
            const typeCargaison = data.typeCargaison.toUpperCase() as TypeCargaison;
            const typeProduit = data.typeProduit.toUpperCase() as TypeColis;
            
            const service = new CargaisonService(typeCargaison);
            
            const colis = new Colis();
            colis.setTypeproduit(typeProduit);
            colis.setPoids(data.poids);
            colis.setPrix(data.prix);
            
            const result = service.ajouterproduit(colis);
            
            const colisData = {
                id: 0, // sera assigné par DataManager
                code: result.getCode(),
                nombre: 1,
                poids: data.poids,
                prix: data.prix,
                typeproduit: typeProduit,
                etat: 'EN_ATTENTE' as EtatColis,
                expediteur: {
                    id: 0,
                    ...data.expediteur
                },
                destinataire: {
                    id: 0,
                    ...data.destinataire
                },
                dateCreation: new Date().toISOString().split('T')[0],
                cargaisonId: undefined
            };
            
            const success = await DataManager.saveNewColis(colisData);
            
            if (success) {
                return {
                    statut: 'succès',
                    data: {
                        code: result.getCode(),
                        message: 'Colis ajouté avec succès'
                    }
                };
            } else {
                return {
                    statut: 'erreur',
                    message: 'Erreur lors de la sauvegarde'
                };
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de l\'ajout du colis'
            };
        }
    }

    static async getAllCargaisons(): Promise<{statut: string, data?: object[], message?: string}> {
        try {
            const cargaisons = await DataManager.getAllCargaisons();
            return {
                statut: 'succès',
                data: cargaisons.map(c => ({
                    id: c.id,
                    numero: c.numero,
                    type: c.type,
                    etat: c.etatglobal,
                    avancement: c.etatAvancement,
                    lieuDepart: c.lieuDepart?.nom || 'Non défini',
                    lieuArrive: c.lieuArrive?.nom || 'Non défini',
                    dateDepart: c.datedepart,
                    dateArrive: c.datedarrive
                }))
            };
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la récupération des cargaisons'
            };
        }
    }

    static async getAllColis(): Promise<{statut: string, data?: object[], message?: string}> {
        try {
            const colis = await DataManager.getAllColis();
            return {
                statut: 'succès',
                data: colis.map(c => ({
                    id: c.id,
                    code: c.code,
                    typeProduit: c.typeproduit,
                    etat: c.etat,
                    poids: c.poids,
                    prix: c.prix,
                    expediteur: `${c.expediteur.prenom} ${c.expediteur.nom}`.trim(),
                    destinataire: `${c.destinataire.prenom} ${c.destinataire.nom}`.trim(),
                    dateCreation: c.dateCreation
                }))
            };
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors de la récupération des colis'
            };
        }
    }

    static async changerEtatColis(code: string, nouvelEtat: string): Promise<{statut: string, message?: string}> {
        try {
            const typeCargaison = TypeCargaison.MARITIME; 
            const service = new CargaisonService(typeCargaison);
            
            const success = service.changerEtatColis(code, nouvelEtat as EtatColis);
            
            if (success) {
                await DataManager.updateColisEtat(code, nouvelEtat.toUpperCase() as EtatColis);
                
                return {
                    statut: 'succès',
                    message: `État du colis ${code} changé vers ${nouvelEtat}`
                };
            } else {
                return {
                    statut: 'erreur',
                    message: 'Colis non trouvé'
                };
            }
        } catch (error) {
            console.error('Erreur lors du changement d\'état:', error);
            return {
                statut: 'erreur',
                message: 'Erreur lors du changement d\'état'
            };
        }
    }

    private static getMessageEtat(etat: string): string {
        const messages: { [key: string]: string } = {
            'EN_ATTENTE': 'Votre colis est en attente de traitement',
            'EN_COURS': 'Votre colis est en cours de transport',
            'ARRIVE': 'Votre colis est arrivé à destination',
            'RECUPERE': 'Votre colis a été récupéré',
            'PERDU': 'Votre colis est malheureusement perdu',
            'ARCHIVE': 'Votre colis a été archivé'
        };
        return messages[etat] || 'État inconnu';
    }
}
