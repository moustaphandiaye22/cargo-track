
# Gestion Cargaison

## Description
Gestion Cargaison est une application complète de gestion et de suivi de cargaisons, développée en TypeScript (Node.js) pour la logique métier et PHP pour l’interface web. Elle permet de gérer les cargaisons, les colis, les utilisateurs, le suivi, la génération de reçus et l’authentification.

## Fonctionnalités principales
- Création et gestion de cargaisons (maritime, aérienne, routière)
- Ajout et suivi de colis dans les cargaisons
- Gestion des utilisateurs (clients, gestionnaires)
- Authentification sécurisée (TypeScriptAuth)
- Génération et consultation de reçus
- Interface web pour gestionnaire et client
- API TypeScript pour automatiser les opérations

## Architecture du projet

```
gestion-cargaison/
├── back/
│   ├── app/
│   │   └── core/
│   │       ├── App.php
│   │       ├── Router.php
│   │       └── TypeScriptAuth.php
│   ├── data/
│   │   └── database.json
│   ├── public/
│   │   ├── index.php
│   │   └── js/
│   ├── routes/
│   │   └── route.web.php
│   ├── template/
│   │   ├── acceuil.php
│   │   ├── client/
│   │   ├── gestionnaire/
│   │   ├── login/
│   │   └── recu/
│   └── utils/
├── typescript/
│   ├── server.ts
│   ├── api/
│   ├── data/
│   ├── entity/
│   ├── Enum/
│   ├── messages/
│   └── service/
├── package.json
├── tsconfig.json
├── README.md
```

## Technologies utilisées
- TypeScript (Node.js)
- PHP (backend web)
- JSON (stockage des données)
- HTML/CSS/JS (frontend)

## Installation
1. Cloner le dépôt :
	```bash
	git clone <url-du-repo>
	```
2. Installer les dépendances TypeScript :
	```bash
	npm install
	```
3. Compiler le serveur TypeScript :
	```bash
	npm run build
	```
4. Lancer le serveur TypeScript :
	```bash
	npm start
	```
5. Configurer le serveur PHP (Apache ou autre) pour pointer sur le dossier `back/public`.

## Utilisation

### API TypeScript
Les commandes principales à utiliser via le serveur TypeScript :

- `login <json>` : Connexion utilisateur
- `validate-token <token>` : Validation du token
- `logout` : Déconnexion
- `create-user <json>` : Création d’un utilisateur
- `suivi <code>` : Suivi d’un colis
- `creer-cargaison <json>` : Création d’une cargaison
- `ajouter-colis <json>` : Ajout d’un colis
- `get-cargaisons` : Liste des cargaisons
- `get-colis` : Liste des colis
- `changer-etat <code> <etat>` : Changer l’état d’un colis

### Structure des données
Les données sont stockées dans `back/data/database.json` sous forme de collections :
- cargaisons
- colis
- personnes
- recus

### Exemple de structure d’une cargaison
```json
{
  "id": 1,
  "numero": 100001,
  "type": "MARITIME",
  "etatGlobal": "OUVERT",
  "etatAvancement": "EN_ATTENTE",
  "poidsMax": 50,
  "distance": 5800,
  "lieuDepart": { "nom": "Dakar" },
  "lieuArrive": { "nom": "Paris" },
  "dateDepart": "2025-01-15",
  "dateArrive": "2025-02-15",
  "dateCreation": "2025-01-10",
  "colis": ["COL780", "COL977"]
}
```

## Sécurité et gestion des erreurs
- Authentification et gestion des sessions via TypeScriptAuth
- Messages d’erreur centralisés dans `typescript/messages/Message.ts`
- Vérification des champs obligatoires côté PHP et TypeScript


## Auteur
- moustaphandiaye22

## Licence
Ce projet est sous licence ISC.
