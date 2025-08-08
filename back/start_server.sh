#!/bin/bash

echo "🚀 Démarrage du serveur CargoTrack..."
echo "📂 Répertoire: $(pwd)"
echo "🌐 URL: http://localhost:8000"
echo ""
echo "Pages disponibles:"
echo "  • http://localhost:8000/ (Accueil)"
echo "  • http://localhost:8000/login (Connexion)"
echo "  • http://localhost:8000/suivi (Suivi de colis)"
echo "  • http://localhost:8000/dashboard (Dashboard gestionnaire)"
echo ""
echo "Comptes de test:"
echo "  • admin / admin123"
echo "  • gestionnaire / gest123"
echo ""
echo "Codes de suivi de test:"
echo "  • COL001 (En cours - Maritime)"
echo "  • COL002 (Arrivé - Aérien)"
echo "  • COL003 (En attente - Routier)"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo "============================================"

# Démarrer le serveur PHP
cd "$(dirname "$0")/public"
php -S localhost:8000
