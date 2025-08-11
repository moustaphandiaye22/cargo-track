#!/bin/bash

echo "🚀 Configuration de l'intégration TypeScript + PHP"
echo "=================================================="

# 1. Installer les dépendances Node.js
echo "📦 Installation des dépendances..."
npm install

# 2. Créer le dossier dist s'il n'existe pas
mkdir -p dist

# 3. Compiler TypeScript
echo "🔧 Compilation TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Compilation réussie!"
    echo "🎯 Le serveur TypeScript est disponible dans: dist/server.js"
    echo ""
    echo "📋 Instructions pour tester:"
    echo "1. Démarrez le serveur PHP:"
    echo "   cd back/public && php -S localhost:8000"
    echo ""
    echo "2. Ouvrez votre navigateur sur:"
    echo "   http://localhost:8000/test-ts"
    echo ""
    echo "3. Testez les APIs TypeScript depuis les vues PHP"
    echo ""
    echo "🔗 Endpoints disponibles:"
    echo "   POST /api/ts/suivi - Suivi de colis"
    echo "   GET  /api/ts/cargaisons - Liste des cargaisons"
    echo "   GET  /api/ts/colis - Liste des colis"
    echo "   POST /api/ts/cargaisons - Créer une cargaison"
    echo "   POST /api/ts/colis - Ajouter un colis"
    echo "   PUT  /api/ts/colis/etat - Changer état colis"
else
    echo "❌ Erreur de compilation!"
    echo "📝 Problèmes détectés dans le code TypeScript"
    echo "🔧 Vérifiez les erreurs ci-dessus et corrigez-les"
fi
