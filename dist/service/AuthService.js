"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Personne_1 = require("../entity/Personne");
const TypePersonne_1 = require("../Enum/TypePersonne");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AuthService {
    static loadUsers() {
        const usersPath = path.join(__dirname, this.usersFilePath);
        try {
            if (fs.existsSync(usersPath)) {
                const data = fs.readFileSync(usersPath, 'utf-8');
                const usersData = JSON.parse(data);
                this.users = usersData.map((userData) => {
                    const user = new Personne_1.Personne();
                    user.setId(userData.id);
                    user.setNom(userData.nom);
                    user.setPrenom(userData.prenom);
                    user.setEmail(userData.email);
                    user.setPassword(userData.password);
                    user.setType(userData.type);
                    user.setAdresse(userData.adresse);
                    user.setTelephone(userData.telephone);
                    return user;
                });
            }
            else {
                this.initializeDefaultUsers();
                this.saveUsers();
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            this.initializeDefaultUsers();
        }
    }
    static saveUsers() {
        const usersPath = path.join(__dirname, this.usersFilePath);
        try {
            const usersData = this.users.map(user => ({
                id: user.getId(),
                nom: user.getNom(),
                prenom: user.getPrenom(),
                email: user.getEmail(),
                password: user.getPassword(),
                type: user.getType(),
                adresse: user.getAdresse(),
                telephone: user.getTelephone()
            }));
            // Créer le dossier s'il n'existe pas
            const dir = path.dirname(usersPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        }
    }
    static initializeDefaultUsers() {
        // Gestionnaire principal
        const gestionnaire = new Personne_1.Personne();
        gestionnaire.setId(1);
        gestionnaire.setNom("Gestionnaire");
        gestionnaire.setPrenom("Principal");
        gestionnaire.setEmail("gestionnaire");
        gestionnaire.setPassword(this.hashPassword("gest123"));
        gestionnaire.setType(TypePersonne_1.TypePersonne.GESTIONNAIRE);
        gestionnaire.setAdresse("Bureau gestion");
        gestionnaire.setTelephone("0000000001");
        this.users = [gestionnaire];
    }
    static hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    static generateToken(user) {
        const payload = {
            id: user.getId(),
            email: user.getEmail(),
            type: user.getType(),
            timestamp: Date.now()
        };
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }
    static async login(credentials) {
        try {
            const { email, password } = credentials;
            if (!email || !password) {
                return {
                    statut: 'erreur',
                    message: 'Email et mot de passe requis'
                };
            }
            const hashedPassword = this.hashPassword(password);
            const user = this.users.find(u => u.getEmail() === email && u.getPassword() === hashedPassword);
            if (!user) {
                return {
                    statut: 'erreur',
                    message: 'Identifiants invalides'
                };
            }
            // Vérifier que c'est un gestionnaire
            if (user.getType() !== TypePersonne_1.TypePersonne.GESTIONNAIRE) {
                return {
                    statut: 'erreur',
                    message: 'Accès réservé aux gestionnaires'
                };
            }
            const token = this.generateToken(user);
            return {
                statut: 'succès',
                message: 'Connexion réussie',
                user: {
                    id: user.getId(),
                    nom: user.getNom(),
                    prenom: user.getPrenom(),
                    email: user.getEmail(),
                    type: user.getType()
                },
                token
            };
        }
        catch (error) {
            return {
                statut: 'erreur',
                message: 'Erreur lors de la connexion'
            };
        }
    }
    static async validateToken(token) {
        try {
            if (!token) {
                return {
                    statut: 'erreur',
                    message: 'Token manquant'
                };
            }
            const payload = JSON.parse(Buffer.from(token, 'base64').toString());
            const user = this.users.find(u => u.getId() === payload.id);
            if (!user) {
                return {
                    statut: 'erreur',
                    message: 'Token invalide'
                };
            }
            // Vérifier si le token n'est pas trop ancien (24h)
            const tokenAge = Date.now() - payload.timestamp;
            if (tokenAge > 24 * 60 * 60 * 1000) {
                return {
                    statut: 'erreur',
                    message: 'Token expiré'
                };
            }
            return {
                statut: 'succès',
                user: {
                    id: user.getId(),
                    nom: user.getNom(),
                    prenom: user.getPrenom(),
                    email: user.getEmail(),
                    type: user.getType()
                }
            };
        }
        catch (error) {
            return {
                statut: 'erreur',
                message: 'Token invalide'
            };
        }
    }
    static async logout() {
        return {
            statut: 'succès',
            message: 'Déconnexion réussie'
        };
    }
    static async createUser(userData) {
        try {
            // Seuls les gestionnaires peuvent être créés
            if (userData.type !== TypePersonne_1.TypePersonne.GESTIONNAIRE) {
                return {
                    statut: 'erreur',
                    message: 'Seuls les gestionnaires peuvent être créés'
                };
            }
            // Vérifier si l'email existe déjà
            const existingUser = this.users.find(u => u.getEmail() === userData.email);
            if (existingUser) {
                return {
                    statut: 'erreur',
                    message: 'Cet email est déjà utilisé'
                };
            }
            const newUser = new Personne_1.Personne();
            const newId = Math.max(...this.users.map(u => u.getId())) + 1;
            newUser.setId(newId);
            newUser.setNom(userData.nom);
            newUser.setPrenom(userData.prenom);
            newUser.setEmail(userData.email);
            newUser.setPassword(this.hashPassword(userData.password));
            newUser.setType(TypePersonne_1.TypePersonne.GESTIONNAIRE);
            newUser.setAdresse(userData.adresse);
            newUser.setTelephone(userData.telephone);
            this.users.push(newUser);
            this.saveUsers(); // Sauvegarder après ajout
            return {
                statut: 'succès',
                message: 'Gestionnaire créé avec succès',
                user: {
                    id: newUser.getId(),
                    nom: newUser.getNom(),
                    prenom: newUser.getPrenom(),
                    email: newUser.getEmail(),
                    type: newUser.getType()
                }
            };
        }
        catch (error) {
            return {
                statut: 'erreur',
                message: 'Erreur lors de la création du gestionnaire'
            };
        }
    }
    static getAllUsers() {
        return this.users;
    }
}
exports.AuthService = AuthService;
_a = AuthService;
AuthService.users = [];
AuthService.usersFilePath = '../data/users.json';
(() => {
    // Charger les utilisateurs depuis le fichier ou initialiser par défaut
    _a.loadUsers();
})();
//# sourceMappingURL=AuthService.js.map