<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu <?php echo htmlspecialchars($recu['numerorecu']); ?> - CargoTrack</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @media print {
            .no-print { display: none; }
            body { font-size: 12px; }
        }
        .coral { color: #FF6B35; }
        .emerald { color: #2ECC71; }
        .charcoal { color: #2C3E50; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen p-4">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- En-tête -->
        <div class="bg-gradient-to-r from-orange-500 to-green-500 text-white p-6">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold mb-2">
                        <i class="fas fa-receipt mr-2"></i>REÇU DE COLIS
                    </h1>
                    <p class="text-xl opacity-90">CargoTrack - Services de Transport</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold"><?php echo htmlspecialchars($recu['numerorecu']); ?></div>
                    <div class="text-sm opacity-90">
                        <?php echo date('d/m/Y H:i', strtotime($recu['dateEmission'])); ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Informations principales -->
        <div class="p-6">
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <!-- Informations du colis -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h2 class="text-xl font-bold charcoal mb-4">
                        <i class="fas fa-box mr-2 coral"></i>Informations du Colis
                    </h2>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="font-semibold">Code:</span>
                            <span class="bg-orange-100 px-2 py-1 rounded font-mono">
                                <?php echo htmlspecialchars($recu['colis']['code']); ?>
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Nombre:</span>
                            <span><?php echo $recu['colis']['nombre']; ?> unité(s)</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Poids:</span>
                            <span><?php echo $recu['colis']['poids']; ?> kg</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Type:</span>
                            <span><?php echo htmlspecialchars($recu['colis']['typeProduit']); ?></span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">État:</span>
                            <span class="px-2 py-1 rounded-full text-xs font-semibold
                                <?php echo $recu['colis']['etat'] === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 
                                          ($recu['colis']['etat'] === 'EN_COURS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'); ?>">
                                <?php echo str_replace('_', ' ', $recu['colis']['etat']); ?>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Informations financières -->
                <div class="bg-green-50 p-4 rounded-lg">
                    <h2 class="text-xl font-bold charcoal mb-4">
                        <i class="fas fa-money-bill-wave mr-2 emerald"></i>Informations Financières
                    </h2>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="font-semibold">Prix unitaire:</span>
                            <span><?php echo number_format($recu['colis']['prix'], 0, ',', ' '); ?> FCFA</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Quantité:</span>
                            <span><?php echo $recu['colis']['nombre']; ?></span>
                        </div>
                        <hr class="my-2">
                        <div class="flex justify-between text-lg font-bold">
                            <span>TOTAL:</span>
                            <span class="emerald">
                                <?php echo number_format($recu['montanttotal'], 0, ',', ' '); ?> FCFA
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Expéditeur et Destinataire -->
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <!-- Expéditeur -->
                <div class="border border-gray-200 p-4 rounded-lg">
                    <h3 class="text-lg font-bold charcoal mb-3">
                        <i class="fas fa-user-circle mr-2 coral"></i>Expéditeur
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div><strong>Nom:</strong> <?php echo htmlspecialchars($recu['expediteur']['nom'] . ' ' . $recu['expediteur']['prenom']); ?></div>
                        <div><strong>Téléphone:</strong> <?php echo htmlspecialchars($recu['expediteur']['telephone']); ?></div>
                        <div><strong>Adresse:</strong> <?php echo htmlspecialchars($recu['expediteur']['adresse']); ?></div>
                    </div>
                </div>

                <!-- Destinataire -->
                <div class="border border-gray-200 p-4 rounded-lg">
                    <h3 class="text-lg font-bold charcoal mb-3">
                        <i class="fas fa-map-marker-alt mr-2 emerald"></i>Destinataire
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div><strong>Nom:</strong> <?php echo htmlspecialchars($recu['destinataire']['nom'] . ' ' . $recu['destinataire']['prenom']); ?></div>
                        <div><strong>Téléphone:</strong> <?php echo htmlspecialchars($recu['destinataire']['telephone']); ?></div>
                        <div><strong>Adresse:</strong> <?php echo htmlspecialchars($recu['destinataire']['adresse']); ?></div>
                    </div>
                </div>
            </div>

            <!-- Informations transport -->
            <?php if (isset($recu['cargaison'])): ?>
            <div class="bg-blue-50 p-4 rounded-lg mb-8">
                <h2 class="text-xl font-bold charcoal mb-4">
                    <i class="fas fa-shipping-fast mr-2 text-blue-600"></i>Informations Transport
                </h2>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-semibold">Cargaison:</span> #<?php echo $recu['cargaison']['numero']; ?>
                    </div>
                    <div>
                        <span class="font-semibold">Type:</span> <?php echo $recu['informationsSupplementaires']['modeTransport'] ?? $recu['cargaison']['type']; ?>
                    </div>
                    <div>
                        <span class="font-semibold">Départ prévu:</span> <?php echo date('d/m/Y', strtotime($recu['cargaison']['dateDepart'])); ?>
                    </div>
                    <div>
                        <span class="font-semibold">Arrivée prévue:</span> <?php echo date('d/m/Y', strtotime($recu['cargaison']['dateArrive'])); ?>
                    </div>
                </div>
            </div>
            <?php endif; ?>

            <!-- QR Code pour suivi -->
            <div class="bg-gray-100 p-4 rounded-lg mb-6 text-center">
                <h3 class="text-lg font-bold charcoal mb-2">
                    <i class="fas fa-qrcode mr-2"></i>Suivi de votre colis
                </h3>
                <p class="text-sm text-gray-600 mb-2">
                    Utilisez ce code pour suivre votre colis sur notre site web
                </p>
                <div class="bg-white p-2 rounded border inline-block">
                    <div class="font-mono text-lg font-bold">
                        <?php echo htmlspecialchars($recu['colis']['code']); ?>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    Rendez-vous sur cargotrack.com/suivi
                </p>
            </div>

            <!-- Conditions -->
            <div class="text-xs text-gray-500 border-t pt-4">
                <h4 class="font-semibold mb-2">Conditions importantes:</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>Ce reçu fait foi pour la récupération du colis</li>
                    <li>Conservez précieusement ce document</li>
                    <li>En cas de perte, contactez notre service client</li>
                    <li>Le colis doit être récupéré dans les 30 jours suivant son arrivée</li>
                </ul>
            </div>
        </div>

        <!-- Actions -->
        <div class="bg-gray-50 p-4 border-t no-print">
            <div class="flex justify-center space-x-4">
                <button onclick="window.print()" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <i class="fas fa-print mr-2"></i>Imprimer
                </button>
                <button onclick="window.close()" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    <i class="fas fa-times mr-2"></i>Fermer
                </button>
            </div>
        </div>
    </div>

    <script>
        // Auto-focus pour impression
        setTimeout(() => {
            // window.print();
        }, 500);
    </script>
</body>
</html>
