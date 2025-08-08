import { CargaisonService } from '../service/CargaisonService';
import { DataManager } from '../data/DataManager';
import { TypeCargaison } from '../Enum/TypeCargaison';
import { TypeColis } from '../Enum/TypeColis';
import { EtatColis } from '../Enum/EtatColis';
import { Colis } from '../entity/Colis';
import { Personne } from '../entity/Personne';

export class ApiController {
    
    // API pour le suivi des colis
    static async suivreColis(code: string): Promise<{statut: string, data?: any, message?: string}> {
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

    // API pour créer une nouvelle cargaison
    static async creerCargaison(data: {
        type: string,
        capacite: number,
        lieuDepart: string,
        lieuArrive: string,
        dateDepart: string,
        dateArrive: string
    }): Promise<{statut: string, data?: any, message?: string}> {
        try {
            const typeCargaison = data.type.toUpperCase() as TypeCargaison;
            
            // Utiliser le service existant pour la logique métier
            const service = new CargaisonService(typeCargaison);
            service.creerCargaison();
            
            // Sauvegarder dans le JSON
            const cargaisonData = {
                type: typeCargaison,
                etatGlobal: 'OUVERT',
                etatAvancement: 'EN_ATTENTE',
                poidsMax: data.capacite,
                lieuDepart: { nom: data.lieuDepart },
                lieuArrive: { nom: data.lieuArrive },
                dateDepart: data.dateDepart,
                dateArrive: data.dateArrive
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

    // API pour ajouter un colis
    static async ajouterColis(data: {
        typeProduit: string,
        poids: number,
        prix: number,
        expediteur: any,
        destinataire: any,
        typeCargaison: string
    }): Promise<{statut: string, data?: any, message?: string}> {
        try {
            const typeCargaison = data.typeCargaison.toUpperCase() as TypeCargaison;
            const typeProduit = data.typeProduit.toUpperCase() as TypeColis;
            
            // Utiliser le service existant pour la validation
            const service = new CargaisonService(typeCargaison);
            
            const colis = new Colis();
            colis.setTypeproduit(typeProduit);
            colis.setPoids(data.poids);
            colis.setPrix(data.prix);
            
            // Appliquer la logique métier du service
            const result = service.ajouterproduit(colis);
            
            // Sauvegarder dans le JSON
            const colisData = {
                code: result.getCode(),
                nombre: 1,
                poids: data.poids,
                prix: data.prix,
                typeProduit: typeProduit,
                etat: 'EN_ATTENTE',
                expediteur: data.expediteur,
                destinataire: data.destinataire,
                dateCreation: new Date().toISOString().split('T')[0],
                cargaisonId: null
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

    // API pour obtenir toutes les cargaisons
    static async getAllCargaisons(): Promise<{statut: string, data?: any[], message?: string}> {
        try {
            const cargaisons = await DataManager.getAllCargaisons();
            return {
                statut: 'succès',
                data: cargaisons.map(c => ({
                    id: c.id,
                    numero: c.numero,
                    type: c.type,
                    etat: c.etatGlobal,
                    avancement: c.etatAvancement,
                    lieuDepart: c.lieuDepart?.nom || 'Non défini',
                    lieuArrive: c.lieuArrive?.nom || 'Non défini',
                    dateDepart: c.dateDepart,
                    dateArrive: c.dateArrive
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

    // API pour obtenir tous les colis
    static async getAllColis(): Promise<{statut: string, data?: any[], message?: string}> {
        try {
            const colis = await DataManager.getAllColis();
            return {
                statut: 'succès',
                data: colis.map(c => ({
                    id: c.id,
                    code: c.code,
                    typeProduit: c.typeProduit,
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

    // API pour changer l'état d'un colis
    static async changerEtatColis(code: string, nouvelEtat: string): Promise<{statut: string, message?: string}> {
        try {
            // Utiliser le service existant pour la logique métier
            const typeCargaison = TypeCargaison.MARITIME; // Par défaut
            const service = new CargaisonService(typeCargaison);
            
            // Appliquer la logique métier
            const success = service.changerEtatColis(code, nouvelEtat as EtatColis);
            
            if (success) {
                // Sauvegarder dans le JSON
                await DataManager.updateColisEtat(code, nouvelEtat.toUpperCase());
                
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
