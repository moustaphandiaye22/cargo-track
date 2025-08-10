    <!-- Modal Nouveau Colis -->
    <div id="modalNouveauColis" class="modal fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-charcoal">Nouveau Colis</h3>
                <button onclick="closeModal('modalNouveauColis')" class="text-medium-gray hover:text-coral text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="space-y-3" method="POST" action="/api/colis" id="formNouveauColis">
                <div class="grid md:grid-cols-2 gap-4">
                   <div>
                        <label class="block text-charcoal font-semibold mb-2">Date de création</label>
                        <input name="dateCreation" type="date" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Nombre</label>
                        <input name="nombre" type="number" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Nombre d'articles" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Poids (kg)</label>
                        <input name="poids" type="number" step="0.01" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Poids" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Prix (FCFA)</label>
                        <input name="prix" type="number" step="0.01" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Prix" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Type de Colis</label>
                        <select name="typeproduit" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                            <option value="ALIMENTAIRE">Alimentaire</option>
                            <option value="CHIMIQUE">Chimique</option>
                            <option value="FRAGILE">Fragile</option>
                            <option value="INCASSABLE">Incassable</option>
                            <option value="MATERIEL">Matériel</option>
                            <option value="AUTRES">Autres</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">État</label>
                        <select name="etat" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="EN_COURS">En cours</option>
                            <option value="ARRIVE">Arrivé</option>
                            <option value="RECUPERE">Récupéré</option>
                            <option value="PERDU">Perdu</option>
                            <option value="ARCHIVE">Archivé</option>
                            <option value="ANNULE">Annulé</option>
                        </select>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Expéditeur - Nom</label>
                        <input name="expediteur_nom" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Nom expéditeur" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Expéditeur - Prénom</label>
                        <input name="expediteur_prenom" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Prénom expéditeur" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Expéditeur - Téléphone</label>
                        <input name="expediteur_telephone" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Téléphone expéditeur" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Expéditeur - Adresse</label>
                        <input name="expediteur_adresse" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Adresse expéditeur" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Destinataire - Nom</label>
                        <input name="destinataire_nom" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Nom destinataire" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Destinataire - Prénom</label>
                        <input name="destinataire_prenom" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Prénom destinataire" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Destinataire - Téléphone</label>
                        <input name="destinataire_telephone" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Téléphone destinataire" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Destinataire - Adresse</label>
                        <input name="destinataire_adresse" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Adresse destinataire" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-1 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Cargaison associée (ID)</label>
                        <input name="cargaison_id" type="number" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="ID de la cargaison" required>
                    </div>
                </div>
                    
                   
                <div class="flex justify-end space-x-4 mt-8">
                    <button type="button" onclick="closeModal('modalNouveauColis')" class="px-6 py-3 border border-light-gray text-medium-gray rounded-lg hover:bg-light-gray transition-all">
                        Annuler
                    </button>
                    <button type="submit" class="btn-gradient text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                        Créer Colis
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
                        <span id="username"><?php echo isset($_SESSION['user']['username']) ? $_SESSION['user']['username'] : 'Admin'; ?></span>
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
            
            <?php if (isset($errorMessage)): ?>
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
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-charcoal">Nouvelle Cargaison</h3>
                <button onclick="closeModal('modalNouvelleCargaison')" class="text-medium-gray hover:text-coral text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form class="space-y-4" method="POST" action="/api/cargaison" id="formNouvelleCargaison">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Type de Cargaison</label>
                        <select name="type" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                            <option value="MARITIME">Maritime</option>
                            <option value="AERIENNE">Aérien</option>
                            <option value="ROUTIERE">Routier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Poids Max (kg)</label>
                        <input name="poidsMax" type="number" step="0.01" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Poids maximum" required>
                    </div>
                </div>
                    
               
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Prix Total (FCFA)</label>
                        <input name="prixtotal" type="number" step="0.01" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Prix total" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Distance (km)</label>
                        <input name="distance" type="number" step="0.01" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Distance" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">État d'Avancement</label>
                        <select name="etatAvancement" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                            <option value="EN_COURS">En cours</option>
                            <option value="ARRIVE">Arrivé</option>
                            <option value="EN_ATTENTE">En attente</option>
                            <option value="EN_RETARD">En retard</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">État Global</label>
                        <select name="etatglobal" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                            <option value="OUVERT">Ouvert</option>
                            <option value="FERME">Fermé</option>
                        </select>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Date de Départ</label>
                        <input name="datedepart" type="date" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Date d'Arrivée</label>
                        <input name="datedarrive" type="date" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Coordonnée Départ (Latitude)</label>
                        <input name="coord_depart_lat" type="number" step="0.000001" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Latitude départ" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Coordonnée Départ (Longitude)</label>
                        <input name="coord_depart_long" type="number" step="0.000001" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Longitude départ" required>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Coordonnée Arrivée (Latitude)</label>
                        <input name="coord_arrive_lat" type="number" step="0.000001" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Latitude arrivée" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Coordonnée Arrivée (Longitude)</label>
                        <input name="coord_arrive_long" type="number" step="0.000001" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Longitude arrivée" required>
                    </div>
                </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Ville de Départ</label>
                        <input name="ville_depart" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Dakar" required>
                    </div>
                    <div>
                        <label class="block text-charcoal font-semibold mb-2">Ville d'Arrivée</label>
                        <input name="ville_arrivee" type="text" class="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-coral focus:outline-none" placeholder="Paris" required>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-4 mt-8">
                    <button type="button" onclick="closeModal('modalNouvelleCargaison')" class="px-6 py-3 border border-light-gray text-medium-gray rounded-lg hover:bg-light-gray transition-all">
                        Annuler
                    </button>
                    <button type="submit" class="btn-gradient text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                        Créer Cargaison
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Le nom d'utilisateur sera affiché via PHP si connecté

        // Tab functionality
        function showTab(tabName) {
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
            document.getElementById(`tab-${tabName}`).classList.remove('hidden');
            
            // Add active class to selected tab button
            event.target.classList.add('active', 'text-coral', 'border-b-2', 'border-coral');
            event.target.classList.remove('text-medium-gray');
        }

        // Modal functionality
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.getElementById(modalId).classList.add('flex');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.getElementById(modalId).classList.remove('flex');
        }

        // Logout functionality
        function seDeconnecter() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                window.location.href = '/logout';
            }
        }

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.add('hidden');
                    this.classList.remove('flex');
                }
            });
        });
    </script>
</body>
</html>

