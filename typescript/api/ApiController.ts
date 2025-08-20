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
import { AuthService, LoginRequest, AuthResponse } from '../service/AuthService';
import { MESSAGES } from '../messages/Message';

export class ApiController {
    
    // API d'authentification
    static async login(credentials: LoginRequest): Promise<AuthResponse> {
        return await AuthService.login(credentials);
    }

    static async validateToken(token: string): Promise<AuthResponse> {
        return await AuthService.validateToken(token);
    }

    static async logout(): Promise<AuthResponse> {
        return await AuthService.logout();
    }

    static async createUser(userData: {
        nom: string;
        prenom: string;
        email: string;
        password: string;
        type: TypePersonne;
        adresse: string;
        telephone: string;
    }): Promise<AuthResponse> {
        return await AuthService.createUser(userData);
    }
    
    // API pour le suivi des colis
    static async suivreColis(code: string): Promise<{statut: string, data?: object, message?: string}> {
        try {
            const colisData = await DataManager.getColisByCode(code);
            
            if (!colisData) {
                return {
                    statut: 'erreur',
                    message: MESSAGES.CODE_SUIVI_NON_TROUVE
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
            console.error(MESSAGES.ERROR_CONNEXION, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CONNEXION
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
                id: 0, 
                numero: 0, 
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
                        message: MESSAGES.SUCCES_CREATE_CARGAISON
                    }
                };
            } else {
                return {
                    statut: 'erreur',
                    message: MESSAGES.ERROR_SAUVEGARDE
                };
            }
        } catch (error) {
            console.error(MESSAGES.ERROR_CREATE_CARGAISON, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CREATE_CARGAISON
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
                id: 0, 
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
                        message: MESSAGES.SUCCES_CREATE_COLIS
                    }
                };
            } else {
                return {
                    statut: 'erreur',
                    message: MESSAGES.ERROR_SAUVEGARDE
                };
            }
        } catch (error) {
            console.error(MESSAGES.ERROR_CREATE_COLIS, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CREATE_COLIS
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
            console.error(MESSAGES.ERROR_CONNEXION, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CONNEXION
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
            console.error(MESSAGES.ERROR_CONNEXION, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CONNEXION
            };
        }
    }

    static async changerEtatColis(code: string, nouvelEtat: string): Promise<{statut: string, message?: string}> {
        try {
            // Vérifier si le colis existe
            const colis = await DataManager.getColisByCode(code);
            
            if (!colis) {
                return {
                    statut: 'erreur',
                    message: MESSAGES.COLIS_NON_TROUVE
                };
            }
            
            // Mettre à jour l'état du colis
            const success = await DataManager.updateColisEtat(code, nouvelEtat.toUpperCase() as EtatColis);
            
            if (success) {
                return {
                    statut: 'succès',
                    message: MESSAGES.ETAT_COLIS_CHANGE
                };
            } else {
                return {
                    statut: 'erreur',
                    message: MESSAGES.ERROR_SAUVEGARDE
                };
            }
        } catch (error) {
            console.error(MESSAGES.ERROR_CONNEXION, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CONNEXION
            };
        }
    }

    private static getMessageEtat(etat: string): string {
        const service = new CargaisonService(TypeCargaison.MARITIME);
        const result = service.suivreColis('dummy');
        const messages: { [key: string]: string } = {
            'EN_ATTENTE': MESSAGES.ETAT_EN_ATTENTE,
            'EN_COURS': MESSAGES.ETAT_EN_COURS,
            'ARRIVE': MESSAGES.ETAT_ARRIVE,
            'RECUPERE': MESSAGES.ETAT_RECUPERE,
            'PERDU': MESSAGES.ETAT_PERDU,
            'ARCHIVE': MESSAGES.ETAT_ARCHIVE
        };
        return messages[etat] || MESSAGES.ETAT_INCONNU;
    }
    
    static async changerEtatCargaison(id: number, nouvelEtat: string): Promise<{statut: string, message?: string}> {
        try {
            // Vérifier si la cargaison existe
            const cargaison = await DataManager.getCargaisonById(id);
            
            if (!cargaison) {
                return {
                    statut: 'erreur',
                    message: 'Cargaison non trouvée'
                };
            }
            
            // Mettre à jour l'état global de la cargaison
            const success = await DataManager.updateCargaisonEtatGlobal(id, nouvelEtat.toUpperCase() as EtatGlobal);
            
            if (success) {
                return {
                    statut: 'succès',
                    message: 'État de la cargaison mis à jour'
                };
            } else {
                return {
                    statut: 'erreur',
                    message: 'Erreur lors de la sauvegarde'
                };
            }
        } catch (error) {
            console.error(MESSAGES.ERROR_CONNEXION, error);
            return {
                statut: 'erreur',
                message: MESSAGES.ERROR_CONNEXION
            };
        }
    }
}
