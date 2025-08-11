import { Personne } from "../entity/Personne";
import { TypePersonne } from "../Enum/TypePersonne";
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    statut: 'succès' | 'erreur';
    message?: string;
    user?: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        type: TypePersonne;
    };
    token?: string;
}

export class AuthService {
    private static users: Personne[] = [];
    private static usersFilePath = '../data/users.json';
    
    static {
        // Charger les utilisateurs depuis le fichier ou initialiser par défaut
        this.loadUsers();
    }

    private static loadUsers(): void {
        const usersPath = path.join(__dirname, this.usersFilePath);
        
        try {
            if (fs.existsSync(usersPath)) {
                const data = fs.readFileSync(usersPath, 'utf-8');
                const usersData = JSON.parse(data);
                
                this.users = usersData.map((userData: any) => {
                    const user = new Personne();
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
            } else {
                this.initializeDefaultUsers();
                this.saveUsers();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            this.initializeDefaultUsers();
        }
    }

    private static saveUsers(): void {
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
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        }
    }

    private static initializeDefaultUsers(): void {
        // Gestionnaire principal
        const gestionnaire = new Personne();
        gestionnaire.setId(1);
        gestionnaire.setNom("Gestionnaire");
        gestionnaire.setPrenom("Principal");
        gestionnaire.setEmail("gestionnaire");
        gestionnaire.setPassword(this.hashPassword("gest123"));
        gestionnaire.setType(TypePersonne.GESTIONNAIRE);
        gestionnaire.setAdresse("Bureau gestion");
        gestionnaire.setTelephone("0000000001");

        this.users = [gestionnaire];
    }

    private static hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    private static generateToken(user: Personne): string {
        const payload = {
            id: user.getId(),
            email: user.getEmail(),
            type: user.getType(),
            timestamp: Date.now()
        };
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }

    static async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const { email, password } = credentials;

            if (!email || !password) {
                return {
                    statut: 'erreur',
                    message: 'Email et mot de passe requis'
                };
            }

            const hashedPassword = this.hashPassword(password);
            const user = this.users.find(u => 
                u.getEmail() === email && u.getPassword() === hashedPassword
            );

            if (!user) {
                return {
                    statut: 'erreur',
                    message: 'Identifiants invalides'
                };
            }

            // Vérifier que c'est un gestionnaire
            if (user.getType() !== TypePersonne.GESTIONNAIRE) {
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
        } catch (error) {
            return {
                statut: 'erreur',
                message: 'Erreur lors de la connexion'
            };
        }
    }

    static async validateToken(token: string): Promise<AuthResponse> {
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
        } catch (error) {
            return {
                statut: 'erreur',
                message: 'Token invalide'
            };
        }
    }

    static async logout(): Promise<AuthResponse> {
        return {
            statut: 'succès',
            message: 'Déconnexion réussie'
        };
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
        try {
            // Seuls les gestionnaires peuvent être créés
            if (userData.type !== TypePersonne.GESTIONNAIRE) {
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

            const newUser = new Personne();
            const newId = Math.max(...this.users.map(u => u.getId())) + 1;
            
            newUser.setId(newId);
            newUser.setNom(userData.nom);
            newUser.setPrenom(userData.prenom);
            newUser.setEmail(userData.email);
            newUser.setPassword(this.hashPassword(userData.password));
            newUser.setType(TypePersonne.GESTIONNAIRE);
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
        } catch (error) {
            return {
                statut: 'erreur',
                message: 'Erreur lors de la création du gestionnaire'
            };
        }
    }

    static getAllUsers(): Personne[] {
        return this.users;
    }
}
