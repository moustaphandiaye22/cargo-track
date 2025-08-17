#!/usr/bin/env node

import { ApiController } from './api/ApiController';
import { MESSAGES } from './messages/Message';

// Fonction principale pour traiter les commandes
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    try {
        let result: {statut: string, data?: unknown, message?: string, commands?: string[]};
        
        switch (command) {
            case 'login':
                const loginData = JSON.parse(args[1] || '{}');
                result = await ApiController.login(loginData);
                break;
                
            case 'validate-token':
                if (!args[1]) {
                    result = { statut: 'erreur', message: MESSAGES.INVALID_TOKEN };
                } else {
                    result = await ApiController.validateToken(args[1]);
                }
                break;
                
            case 'logout':
                result = await ApiController.logout();
                break;
                
            case 'create-user':
                const userData = JSON.parse(args[1] || '{}');
                result = await ApiController.createUser(userData);
                break;
                
            case 'suivi':
                if (!args[1]) {
                    result = { statut: 'erreur', message: MESSAGES.CODE_SUIVI_REQUIS };
                } else {
                    result = await ApiController.suivreColis(args[1]);
                }
                break;
                
            case 'creer-cargaison':
                const cargaisonData = JSON.parse(args[1] || '{}');
                result = await ApiController.creerCargaison(cargaisonData);
                break;
                
            case 'ajouter-colis':
                const colisData = JSON.parse(args[1] || '{}');
                result = await ApiController.ajouterColis(colisData);
                break;
                
            case 'get-cargaisons':
                result = await ApiController.getAllCargaisons();
                break;
                
            case 'get-colis':
                result = await ApiController.getAllColis();
                break;
                
            case 'changer-etat':
                if (!args[1] || !args[2]) {
                    result = { statut: 'erreur', message: MESSAGES.CODE_ETAT_REQUIS };
                } else {
                    result = await ApiController.changerEtatColis(args[1], args[2]);
                }
                break;
                
            default:
                result = {
                    statut: 'erreur',
                    message: MESSAGES.COMMANDE_NON_RECONNUE,
                    commands: [
                        'login <json>',
                        'validate-token <token>',
                        'logout',
                        'create-user <json>',
                        'suivi <code>',
                        'creer-cargaison <json>',
                        'ajouter-colis <json>',
                        'get-cargaisons',
                        'get-colis',
                        'changer-etat <code> <etat>'
                    ]
                };
        }
        
        // Retourner le résultat en JSON
        console.log(JSON.stringify(result));
        
    } catch (error) {
        console.log(JSON.stringify({
            statut: 'erreur',
            message: MESSAGES.ERREUR_SERVEUR + ': ' + (error instanceof Error ? error.message : 'Erreur inconnue')
        }));
        process.exit(1);
    }
}

// Exécuter la fonction principale
main();
