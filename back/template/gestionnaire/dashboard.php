<?php
// Charger les utilitaires du dashboard
require_once dirname(__DIR__, 2) . '/utils/dashboard_helpers.php';

// Charger les données depuis database.json
$data = loadDatabaseData();
if ($data === null) {
    $data = ['cargaisons' => [], 'colis' => []];
}

// Gérer les messages de session
$successMessage = null;
$errorMessage = null;

if (isset($_SESSION['success_message'])) {
    $successMessage = $_SESSION['success_message'];
    unset($_SESSION['success_message']);
}

if (isset($_SESSION['error_message'])) {
    $errorMessage = $_SESSION['error_message'];
    unset($_SESSION['error_message']);
}

// Gérer le reçu généré
$recuGenere = null;
if (isset($_SESSION['recu_genere'])) {
    $recuGenere = $_SESSION['recu_genere'];
    unset($_SESSION['recu_genere']);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CargoTrack</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --coral: #FF6B35;
            --emerald: #2ECC71;
            --charcoal: #2C3E50;
            --light-gray: #F8F9FA;
            --medium-gray: #6C757D;
        }
        .btn-gradient {
            background: linear-gradient(135deg, var(--coral), var(--emerald));
        }
        .tab-active {
            background: var(--coral);
            color: white;
        }
    </style>
</head>
<body class="bg-light-gray min-h-screen">

    <!-- Modal Nouveau Colis -->
    <div id="modalNouveauColis" class="modal fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-charcoal">Nouveau Colis</h3>
                <button onclick="closeModal('modalNouveauColis')" class="text-medium-gray hover:text-coral text-xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="space-y-4" method="POST" action="/api/colis" id="formNouveauColis">
                <!-- Info de base -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Date de création *</label>
                        <input name="dateCreation" type="date" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" >
                        <span class="error-message text-red-500 text-xs hidden"></span>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Nombre *</label>
                        <input name="nombre" type="number" min="1" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Qté" >
                        <span class="error-message text-red-500 text-xs hidden"></span>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Poids (kg) *</label>
                        <input name="poids" type="number" step="0.01" min="0.01" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="0.0" >
                        <span class="error-message text-red-500 text-xs hidden"></span>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Prix (FCFA) *</label>
                        <input name="prix" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="0" >
                        <span class="error-message text-red-500 text-xs hidden"></span>
                        <small class="text-xs text-emerald">Minimum automatique : 10 000 FCFA</small>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Type de Colis *</label>
                        <select name="typeproduit" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                            <option value="">Sélectionner...</option>
                            <option value="ALIMENTAIRE">Alimentaire</option>
                            <option value="CHIMIQUE">Chimique</option>
                            <option value="FRAGILE">Fragile</option>
                            <option value="INCASSABLE">Incassable</option>
                            <option value="MATERIEL">Matériel</option>
                            <option value="AUTRES">Autres</option>
                        </select>
                        <span class="error-message text-red-500 text-xs hidden"></span>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Compatibilité transport</label>
                        <div id="transport-compatibility" class="text-xs p-2 bg-light-gray rounded text-medium-gray">
                            Sélectionnez un type et une cargaison pour voir la compatibilité
                        </div>
                    </div>
                </div>

                <!-- Expéditeur -->
                <div class="bg-light-gray p-3 rounded-lg">
                    <h4 class="font-semibold text-charcoal mb-2 text-sm">Expéditeur *</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <input name="expediteur_nom" type="text" minlength="2" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Nom *">
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="expediteur_prenom" type="text" minlength="2" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Prénom *" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="expediteur_telephone" type="tel" pattern="[+]?[0-9\s\-()]{8,}" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Téléphone * (+221771234567)">
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="expediteur_adresse" type="text" minlength="5" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Adresse complète *" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                    </div>
                </div>

                <!-- Destinataire -->
                <div class="bg-light-gray p-3 rounded-lg">
                    <h4 class="font-semibold text-charcoal mb-2 text-sm">Destinataire *</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <input name="destinataire_nom" type="text" minlength="2" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Nom *" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="destinataire_prenom" type="text" minlength="2" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Prénom *" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="destinataire_telephone" type="tel" pattern="[+]?[0-9\s\-()]{8,}" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Téléphone * (+33612345678)" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                        <div>
                            <input name="destinataire_adresse" type="text" minlength="5" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Adresse complète *" >
                            <span class="error-message text-red-500 text-xs hidden"></span>
                        </div>
                    </div>
                </div>

                <!-- Cargaison -->
                <div>
                    <label class="block text-charcoal font-semibold mb-1 text-sm">Cargaison de destination *</label>
                    <select name="cargaison_id" id="selectCargaison" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                        <option value="">Sélectionner une cargaison...</option>
                        <?php 
                        if (isset($data['cargaisons'])) {
                            foreach ($data['cargaisons'] as $cargaison) {
                                if ($cargaison['etatGlobal'] === 'OUVERT') {
                                    echo "<option value='{$cargaison['id']}' data-type='{$cargaison['type']}'>";
                                    echo "#{$cargaison['numero']} - {$cargaison['type']} ({$cargaison['lieuDepart']['nom']} → {$cargaison['lieuArrive']['nom']})";
                                    echo "</option>";
                                }
                            }
                        }
                        ?>
                    </select>
                    <span class="error-message text-red-500 text-xs hidden"></span>
                    <small class="text-medium-gray text-xs">Seules les cargaisons ouvertes sont disponibles</small>
                </div>
                    
                <!-- Messages -->
                <div id="form-messages" class="hidden">
                    <div id="success-message" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg mb-4 hidden">
                        <i class="fas fa-check-circle mr-2"></i>
                        <span></span>
                    </div>
                    <div id="error-message" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4 hidden">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <span></span>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-light-gray">
                    <button type="button" onclick="closeModal('modalNouveauColis')" class="px-4 py-2 border border-light-gray text-medium-gray rounded-lg hover:bg-light-gray transition-all text-sm">
                        Annuler
                    </button>
                    <button type="submit" id="submit-colis-btn" class="btn-gradient text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                        <span class="btn-text">Créer Colis</span>
                        <i class="fas fa-spinner fa-spin hidden ml-2"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
<?php
// Charger les fonctions utilitaires
require_once __DIR__ . '/../../utils/dashboard_helpers.php';

// Charger les données depuis database.json
$data = loadDatabaseData();
$stats = calculerStatistiques($data);

// Gestion d'erreur si les données ne peuvent pas être chargées
if (!$data) {
    $errorMessage = "Erreur : Impossible de charger les données. Vérifiez que le fichier database.json existe et est accessible.";
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de Bord Gestionnaire - CargoTrack</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'coral': '#FF8C00',
                        'sunset': '#FF8E53',
                        'emerald': '#4ECDC4',
                        'golden': '#FFE66D',
                        'charcoal': '#2C3E50',
                        'light-gray': '#ECF0F1',
                        'medium-gray': '#95A5A6'
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg {
            background: #FF8C00;
        }
        .btn-gradient {
            background: #FF8C00;
        }
        .btn-gradient:hover {
            background: linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
        }
        .stat-card {
            transition: all 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .modal {
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body class="bg-light-gray min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <i class="fas fa-truck text-coral text-2xl mr-3"></i>
                    <span class="text-2xl font-bold text-charcoal">CargoTrack</span>
                    <span class="ml-4 px-3 py-1 bg-emerald text-white text-sm rounded-full">Gestionnaire</span>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="hidden md:flex items-center space-x-2 text-charcoal">
                        <i class="fas fa-user-circle text-coral"></i>
                        <span id="username"><?php echo isset($_SESSION['user']['email']) ? $_SESSION['user']['email'] : 'Gestionnaire'; ?></span>
                    </div>
                    <button onclick="seDeconnecter()" class="bg-coral hover:bg-sunset text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                        <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <section class="gradient-bg text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
                <i class="fas fa-tachometer-alt mr-3"></i>Tableau de Bord Gestionnaire
            </h1>
            <p class="text-xl opacity-90">Gérez vos cargaisons, colis et clients en temps réel</p>
            
            <?php if ($successMessage): ?>
            <div class="mt-4 bg-green-500 bg-opacity-20 border border-green-300 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        <span><?php echo htmlspecialchars($successMessage); ?></span>
                    </div>
                    <?php if ($recuGenere): ?>
                    <a href="/recu?numero=<?php echo urlencode($recuGenere); ?>" 
                       target="_blank"
                       class="bg-white text-green-600 px-4 py-2 rounded-lg border border-green-300 hover:bg-green-50 transition-colors">
                        <i class="fas fa-receipt mr-2"></i>Voir le reçu
                    </a>
                    <?php endif; ?>
                </div>
            </div>
            <?php endif; ?>
            
            <?php if ($errorMessage): ?>
            <div class="mt-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-4">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span><?php echo htmlspecialchars($errorMessage); ?></span>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Statistics Cards -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="stat-card bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-medium-gray text-sm font-semibold">Colis Actifs</p>
                            <p class="text-3xl font-bold text-charcoal"><?php echo formatNumber($stats['colis_actifs']); ?></p>
                            <p class="text-emerald text-sm"><?php echo calculerVariation('colis_actifs'); ?>% ce mois</p>
                        </div>
                        <div class="w-12 h-12 bg-coral rounded-lg flex items-center justify-center">
                            <i class="fas fa-box text-white text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-medium-gray text-sm font-semibold">Cargaisons</p>
                            <p class="text-3xl font-bold text-charcoal"><?php echo formatNumber($stats['nombre_cargaisons']); ?></p>
                            <p class="text-emerald text-sm"><?php echo calculerVariation('nombre_cargaisons'); ?>% ce mois</p>
                        </div>
                        <div class="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center">
                            <i class="fas fa-ship text-white text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-medium-gray text-sm font-semibold">En Transit</p>
                            <p class="text-3xl font-bold text-charcoal"><?php echo formatNumber($stats['colis_en_transit']); ?></p>
                            <p class="text-golden text-sm">Temps réel</p>
                        </div>
                        <div class="w-12 h-12 bg-golden rounded-lg flex items-center justify-center">
                            <i class="fas fa-truck text-white text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-medium-gray text-sm font-semibold">Clients</p>
                            <p class="text-3xl font-bold text-charcoal"><?php echo formatNumber($stats['nombre_clients']); ?></p>
                            <p class="text-emerald text-sm"><?php echo calculerVariation('nombre_clients'); ?>% ce mois</p>
                        </div>
                        <div class="w-12 h-12 bg-sunset rounded-lg flex items-center justify-center">
                            <i class="fas fa-users text-white text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Tab Navigation -->
            <div class="bg-white rounded-xl shadow-lg mb-8">
                <div class="flex flex-wrap border-b border-light-gray">
                    <button onclick="showTab('cargaisons')" class="tab-btn active px-6 py-4 font-semibold text-coral border-b-2 border-coral">
                        <i class="fas fa-ship mr-2"></i>Cargaisons
                    </button>
                    <button onclick="showTab('colis')" class="tab-btn px-6 py-4 font-semibold text-medium-gray hover:text-coral transition-colors">
                        <i class="fas fa-box mr-2"></i>Colis
                    </button>
                    <button onclick="showTab('clients')" class="tab-btn px-6 py-4 font-semibold text-medium-gray hover:text-coral transition-colors">
                        <i class="fas fa-users mr-2"></i>Clients
                    </button>
                    <button onclick="showTab('nouveau')" class="tab-btn px-6 py-4 font-semibold text-medium-gray hover:text-coral transition-colors">
                        <i class="fas fa-plus mr-2"></i>Nouveau
                    </button>
                </div>

                <!-- Cargaisons Tab -->
                <div id="tab-cargaisons" class="tab-content p-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold text-charcoal">Gestion des Cargaisons</h2>
                        <button onclick="openModal('modalNouvelleCargaison')" class="btn-gradient text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                            <i class="fas fa-plus mr-2"></i>Nouvelle Cargaison
                        </button>
                    </div>

                    <div class="mb-4">
                        <input type="text" placeholder="Rechercher une cargaison..." class="w-full md:w-1/3 px-4 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none">
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full bg-white rounded-lg shadow">
                            <thead class="bg-light-gray">
                                <tr>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Numéro</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Type</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Route</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">État</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Colis</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-light-gray">
                                <?php echo genererTableauCargaisons($data); ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Colis Tab -->
                <div id="tab-colis" class="tab-content p-6 hidden">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold text-charcoal">Gestion des Colis</h2>
                        <button onclick="openModal('modalNouveauColis')" class="btn-gradient text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                            <i class="fas fa-plus mr-2"></i>Nouveau Colis
                        </button>
                    </div>

                    <div class="mb-4">
                        <input type="text" placeholder="Rechercher par code colis..." class="w-full md:w-1/3 px-4 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none">
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full bg-white rounded-lg shadow">
                            <thead class="bg-light-gray">
                                <tr>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Code</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Expéditeur</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Destinataire</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Poids</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">État</th>
                                    <th class="px-6 py-3 text-left text-charcoal font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-light-gray">
                                <?php echo genererTableauColis($data); ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Clients Tab -->
                <div id="tab-clients" class="tab-content p-6 hidden">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold text-charcoal">Gestion des Clients</h2>
                        <button onclick="openModal('modalNouveauClient')" class="btn-gradient text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                            <i class="fas fa-plus mr-2"></i>Nouveau Client
                        </button>
                    </div>

                    <div class="mb-4">
                        <input type="text" placeholder="Rechercher un client..." class="w-full md:w-1/3 px-4 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none">
                    </div>

                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <?php echo genererCarteClients($data); ?>
                    </div>
                </div>

                <!-- Nouveau Tab -->
                <div id="tab-nouveau" class="tab-content p-6 hidden">
                    <h2 class="text-2xl font-bold text-charcoal mb-6">Actions Rapides</h2>
                    
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button onclick="openModal('modalNouvelleCargaison')" class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all text-center group">
                            <div class="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <i class="fas fa-ship text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-bold text-charcoal mb-2">Nouvelle Cargaison</h3>
                            <p class="text-medium-gray text-sm">Créer une nouvelle cargaison maritime, aérienne ou routière</p>
                        </button>

                        <button onclick="openModal('modalNouveauColis')" class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all text-center group">
                            <div class="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <i class="fas fa-box text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-bold text-charcoal mb-2">Nouveau Colis</h3>
                            <p class="text-medium-gray text-sm">Enregistrer un nouveau colis dans le système</p>
                        </button>

                       
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Modals -->
    <!-- Modal Nouvelle Cargaison -->
    <div id="modalNouvelleCargaison" class="modal fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-charcoal">Nouvelle Cargaison</h3>
                <button onclick="closeModal('modalNouvelleCargaison')" class="text-medium-gray hover:text-coral text-xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form class="space-y-4" method="POST" action="/api/cargaison" id="formNouvelleCargaison">
                <!-- Informations de base -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Type de Transport</label>
                        <select name="type" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                            <option value="MARITIME">Maritime</option>
                            <option value="AERIENNE">Aérien</option>
                            <option value="ROUTIERE">Routier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Poids Max (kg)</label>
                        <input name="poidsMax" type="number" step="0.01" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="50.0">
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Distance (km)</label>
                        <input name="distance" type="number" step="0.01" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="5800">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">Prix Total (FCFA)</label>
                        <input name="prixtotal" type="number" step="0.01" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="100000">
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">État d'Avancement</label>
                        <select name="etatAvancement" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="ARRIVE">Arrivé</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-1 text-sm">État Global</label>
                        <select name="etatglobal" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                            <option value="OUVERT">Ouvert</option>
                            <option value="FERME">Fermé</option>
                        </select>
                    </div>
                </div>

                <!-- Dates et lieux -->
                <div class="bg-light-gray p-3 rounded-lg">
                    <h4 class="font-semibold text-charcoal mb-2 text-sm">Itinéraire et dates</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-charcoal font-medium mb-1 text-xs">Ville de Départ</label>
                            <input name="ville_depart" type="text" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Dakar">
                        </div>
                        <div>
                            <label class="block text-charcoal font-medium mb-1 text-xs">Ville d'Arrivée</label>
                            <input name="ville_arrivee" type="text" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Paris">
                        </div>
                        <div>
                            <label class="block text-charcoal font-medium mb-1 text-xs">Date de Départ</label>
                            <input name="datedepart" type="date" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                        </div>
                        <div>
                            <label class="block text-charcoal font-medium mb-1 text-xs">Date d'Arrivée</label>
                            <input name="datedarrive" type="date" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm">
                        </div>
                    </div>
                </div>

                <!-- Coordonnées GPS (optionnel) -->
                <div class="bg-light-gray p-3 rounded-lg">
                    <h4 class="font-semibold text-charcoal mb-2 text-sm">Coordonnées GPS (optionnel)</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="space-y-2">
                            <p class="text-xs text-medium-gray font-medium">Point de départ</p>
                            <div class="grid grid-cols-2 gap-2">
                                <input name="coord_depart_lat" type="number" step="0.000001" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Latitude">
                                <input name="coord_depart_long" type="number" step="0.000001" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Longitude">
                            </div>
                        </div>
                        <div class="space-y-2">
                            <p class="text-xs text-medium-gray font-medium">Point d'arrivée</p>
                            <div class="grid grid-cols-2 gap-2">
                                <input name="coord_arrive_lat" type="number" step="0.000001" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Latitude">
                                <input name="coord_arrive_long" type="number" step="0.000001" class="w-full px-3 py-2 border border-light-gray rounded-lg focus:border-coral focus:outline-none text-sm" placeholder="Longitude">
                            </div>
                        </div>
                    </div>
                    <small class="text-xs text-medium-gray">Les coordonnées GPS permettront un suivi précis de la cargaison</small>
                </div>
                
                <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-light-gray">
                    <button type="button" onclick="closeModal('modalNouvelleCargaison')" class="px-4 py-2 border border-light-gray text-medium-gray rounded-lg hover:bg-light-gray transition-all text-sm">
                        Annuler
                    </button>
                    <button type="submit" id="submit-cargaison-btn" class="btn-gradient text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                        <span class="btn-text">Créer Cargaison</span>
                        <i class="fas fa-spinner fa-spin hidden ml-2"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Scripts modulaires chargés avant la fermeture du body -->
    <script type="module" src="/js/form-validator.js"></script>
    <script type="module" src="/js/transport-compatibility.js"></script>
    <script type="module" src="/js/modal-manager.js"></script>
    <script type="module" src="/js/form-handler.js"></script>
    <script type="module" src="/js/dashboard.js"></script>

    <script>
        // Variables globales pour les instances
        let dashboard, modalManager, formValidator, transportCompatibility, formHandler;
        
        // Initialisation quand le DOM est prêt
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Créer les instances
                if (typeof FormValidator !== 'undefined') {
                    formValidator = new FormValidator();
                } else {
                    formValidator = null;
                }
                if (typeof TransportCompatibility !== 'undefined') {
                    transportCompatibility = new TransportCompatibility();
                } else {
                    transportCompatibility = null;
                }
                modalManager = new ModalManager();
                if (formValidator) {
                    formHandler = new FormHandler(formValidator);
                } else {
                    formHandler = null;
                }
                dashboard = new Dashboard();
                // Exposer globalement pour les événements onclick
                window.modalManager = modalManager;
                window.formValidator = formValidator;
                window.transportCompatibility = transportCompatibility;
                window.formHandler = formHandler;
                window.dashboard = dashboard;
                console.log('Dashboard initialisé avec succès');
            } catch (error) {
                console.error("Erreur lors de l'initialisation du dashboard:", error);
            }
        });
        
        // Fonctions globales pour les événements onclick (définies immédiatement)
        function openModal(modalId) {
            console.log('openModal appelé avec:', modalId);
            if (window.modalManager) {
                window.modalManager.openModal(modalId);
            } else {
                // Fallback si les modules ne sont pas chargés
                console.warn('modalManager non disponible, utilisation du fallback');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                }
            }
        }
        
        function closeModal(modalId) {
            console.log('closeModal appelé avec:', modalId);
            if (window.modalManager) {
                window.modalManager.closeModal(modalId);
            } else {
                // Fallback si les modules ne sont pas chargés
                console.warn('modalManager non disponible, utilisation du fallback');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = '';
                }
            }
        }
        
        function showTab(tabName) {
            console.log('showTab appelé avec:', tabName);
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active', 'text-coral', 'border-b-2', 'border-coral');
                btn.classList.add('text-medium-gray');
            });
            
            // Show selected tab
            const targetTab = document.getElementById(`tab-${tabName}`);
            if (targetTab) {
                targetTab.classList.remove('hidden');
            }
            
            // Add active class to selected tab button
            if (event && event.target) {
                event.target.classList.add('active', 'text-coral', 'border-b-2', 'border-coral');
                event.target.classList.remove('text-medium-gray');
            }
        }
        
        function seDeconnecter() {
            console.log('seDeconnecter appelé');
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                window.location.href = '/logout';
            }
        }
        
        // Debug - vérifier que les fonctions sont disponibles
        console.log('Fonctions globales définies:', {
            openModal: typeof openModal,
            closeModal: typeof closeModal,
            showTab: typeof showTab,
            seDeconnecter: typeof seDeconnecter
        });
    </script>
</body>
</html>

