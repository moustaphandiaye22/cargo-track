<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suivi de Colis - CargoTrack</title>
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
        .timeline-item {
            position: relative;
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 60px;
            bottom: -20px;
            width: 2px;
            background: #ECF0F1;
        }
        .timeline-item:last-child::before {
            display: none;
        }
        .status-completed {
            background: #4ECDC4;
            color: white;
        }
        .status-current {
            background: #FF8C00;
            color: white;
        }
        .status-pending {
            background: #ECF0F1;
            color: #95A5A6;
        }
    </style>
</head>
<body class="bg-light-gray min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <i class="fas fa-truck text-coral text-2xl mr-3"></i>
                    <span class="text-2xl font-bold text-charcoal">CargoTrack</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="/" class="text-charcoal hover:text-coral transition-colors duration-300">
                        <i class="fas fa-home mr-2"></i>Accueil
                    </a>
                    <a href="/suivi" class="text-coral font-semibold border-b-2 border-coral pb-1">
                        <i class="fas fa-search mr-2"></i>Suivi Colis
                    </a>
                    <a href="/login" class="text-charcoal hover:text-coral transition-colors duration-300">
                        <i class="fas fa-user-lock mr-2"></i>Connexion
                    </a>
                </div>
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-charcoal hover:text-coral">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a href="index.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-home mr-2"></i>Accueil
                </a>
                <a href="suivi.html" class="block px-3 py-2 text-coral font-semibold">
                    <i class="fas fa-search mr-2"></i>Suivi Colis
                </a>
                <a href="connexion.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-user-lock mr-2"></i>Connexion
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg text-white py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
                <i class="fas fa-search mr-4"></i>Suivi de Colis
            </h1>
            <p class="text-xl opacity-90">
                Entrez votre code de suivi pour connaître l'état de votre colis en temps réel
            </p>
        </div>
    </section>

    <!-- Search Section -->
    <section class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-charcoal mb-4">Rechercher votre Colis</h2>
                    <p class="text-medium-gray">Saisissez votre code de suivi pour obtenir des informations détaillées</p>
                </div>
                
                <div class="max-w-2xl mx-auto">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <input 
                                type="text" 
                                id="codesuivi" 
                                placeholder="Ex: CG123456789, PKG001, TRK789456123"
                                class="w-full px-6 py-4 border-2 border-light-gray rounded-xl text-lg focus:border-coral focus:outline-none transition-colors duration-300"
                            >
                        </div>
                        <button 
                            onclick="suivreColis()" 
                            class="btn-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <i class="fas fa-search mr-2"></i>Rechercher
                        </button>
                    </div>
                    
                    <div class="mt-4 text-center">
                        <p class="text-sm text-medium-gray">
                            Vous ne trouvez pas votre code ? 
                            <a href="#" class="text-coral hover:underline">Contactez notre support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Results Section -->
    <section id="resultatSuivi" class="py-8 hidden">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Package Info Card -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-charcoal mb-2">Informations du Colis</h3>
                        <p class="text-medium-gray">Code de suivi: <span id="trackingCode" class="font-semibold text-charcoal"></span></p>
                    </div>
                    <div class="mt-4 lg:mt-0">
                        <span id="statusBadge" class="inline-block px-6 py-3 rounded-full font-semibold text-lg"></span>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-light-gray rounded-xl p-4">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-user text-coral mr-2"></i>
                            <span class="font-semibold text-charcoal">Expéditeur</span>
                        </div>
                        <p id="expediteur" class="text-medium-gray">-</p>
                    </div>
                    
                    <div class="bg-light-gray rounded-xl p-4">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-map-marker-alt text-emerald mr-2"></i>
                            <span class="font-semibold text-charcoal">Destinataire</span>
                        </div>
                        <p id="destinataire" class="text-medium-gray">-</p>
                    </div>
                    
                    <div class="bg-light-gray rounded-xl p-4">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-weight text-golden mr-2"></i>
                            <span class="font-semibold text-charcoal">Poids</span>
                        </div>
                        <p id="poids" class="text-medium-gray">-</p>
                    </div>
                    
                    <div class="bg-light-gray rounded-xl p-4">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-calendar text-sunset mr-2"></i>
                            <span class="font-semibold text-charcoal">Date d'envoi</span>
                        </div>
                        <p id="dateEnvoi" class="text-medium-gray">-</p>
                    </div>
                </div>
            </div>

            <!-- Timeline -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h3 class="text-2xl font-bold text-charcoal mb-8">Historique de Livraison</h3>
                
                <div id="timeline" class="space-y-8">
                    <!-- Timeline items will be inserted here -->
                </div>
            </div>
        </div>
    </section>

    <!-- No Results Section -->
    <section id="aucunResultat" class="py-8 hidden">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="w-24 h-24 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-medium-gray text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-charcoal mb-4">Aucun Résultat Trouvé</h3>
                <p class="text-medium-gray mb-6">
                    Nous n'avons trouvé aucun colis correspondant au code de suivi saisi. 
                    Veuillez vérifier le code et réessayer.
                </p>
                <div class="space-y-4">
                    <p class="text-sm text-medium-gray">Conseils :</p>
                    <ul class="text-sm text-medium-gray space-y-2 max-w-md mx-auto">
                        <li>• Vérifiez que le code est correct (sans espaces)</li>
                        <li>• Le code peut prendre jusqu'à 24h pour être activé</li>
                        <li>• Contactez notre support si le problème persiste</li>
                    </ul>
                </div>
                <button onclick="resetSearch()" class="mt-6 btn-gradient text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                    <i class="fas fa-redo mr-2"></i>Nouvelle Recherche
                </button>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-charcoal mb-4">Questions Fréquentes</h2>
                <p class="text-xl text-medium-gray">Tout ce que vous devez savoir sur le suivi de colis</p>
            </div>
            
            <div class="space-y-6">
                <div class="bg-light-gray rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-charcoal mb-3">
                        <i class="fas fa-question-circle text-coral mr-2"></i>
                        Où puis-je trouver mon code de suivi ?
                    </h3>
                    <p class="text-medium-gray">
                        Votre code de suivi vous est envoyé par email ou SMS lors de l'expédition de votre colis. 
                        Il figure également sur votre reçu d'envoi.
                    </p>
                </div>
                
                <div class="bg-light-gray rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-charcoal mb-3">
                        <i class="fas fa-question-circle text-coral mr-2"></i>
                        À quelle fréquence les informations sont-elles mises à jour ?
                    </h3>
                    <p class="text-medium-gray">
                        Les informations de suivi sont mises à jour en temps réel. 
                        Cependant, il peut y avoir un délai de quelques heures selon le mode de transport.
                    </p>
                </div>
                
                <div class="bg-light-gray rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-charcoal mb-3">
                        <i class="fas fa-question-circle text-coral mr-2"></i>
                        Que faire si mon colis semble bloqué ?
                    </h3>
                    <p class="text-medium-gray">
                        Si votre colis n'a pas bougé depuis plus de 48h, contactez notre service client. 
                        Il peut s'agir d'un contrôle douanier ou d'un problème logistique temporaire.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-charcoal text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <i class="fas fa-truck text-coral text-2xl mr-3"></i>
                        <span class="text-2xl font-bold">CargoTrack</span>
                    </div>
                    <p class="text-gray-400 mb-4">Votre partenaire de confiance pour tous vos besoins logistiques et de transport.</p>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Services</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Maritime</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Aérien</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Routier</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Support</h3>
                    <ul class="space-y-2">
                        <li><a href="suivi.html" class="text-gray-400 hover:text-coral transition-colors">Suivi de Colis</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">FAQ</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Contact</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-3 text-coral"></i>
                            +221 33 123 45 67
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-3 text-coral"></i>
                            contact@cargotrack.sn
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-700 mt-8 pt-8 text-center">
                <p class="text-gray-400">&copy; 2025 CargoTrack. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
        
        // Sample tracking data
        const trackingData = {
            'CG123456789': {
                expediteur: 'Jean Dupont',
                destinataire: 'Marie Martin - Paris, France',
                poids: '2.5 kg',
                dateEnvoi: '15 Janvier 2024',
                status: 'En Transit',
                timeline: [
                    { date: '15 Jan 2024 - 09:00', status: 'Colis expédié', location: 'Dakar, Sénégal', completed: true },
                    { date: '16 Jan 2024 - 14:30', status: 'En transit vers le port', location: 'Port de Dakar', completed: true },
                    { date: '18 Jan 2024 - 08:00', status: 'Embarqué sur navire', location: 'Port de Dakar', completed: true },
                    { date: '25 Jan 2024 - 16:00', status: 'En transit maritime', location: 'Océan Atlantique', completed: false, current: true },
                    { date: 'Estimation', status: 'Arrivée au port de destination', location: 'Le Havre, France', completed: false },
                    { date: 'Estimation', status: 'Livraison finale', location: 'Paris, France', completed: false }
                ]
            },
            'PKG001': {
                expediteur: 'Société ABC',
                destinataire: 'Client XYZ - Thiès, Sénégal',
                poids: '15.2 kg',
                dateEnvoi: '20 Janvier 2024',
                status: 'Livré',
                timeline: [
                    { date: '20 Jan 2024 - 10:00', status: 'Colis expédié', location: 'Dakar, Sénégal', completed: true },
                    { date: '20 Jan 2024 - 15:30', status: 'En transit routier', location: 'Route Dakar-Thiès', completed: true },
                    { date: '21 Jan 2024 - 09:15', status: 'Arrivé au centre de tri', location: 'Thiès, Sénégal', completed: true },
                    { date: '21 Jan 2024 - 14:45', status: 'En cours de livraison', location: 'Thiès, Sénégal', completed: true },
                    { date: '21 Jan 2024 - 16:20', status: 'Livré avec succès', location: 'Thiès, Sénégal', completed: true }
                ]
            }
        };

        function suivreColis() {
            const code = document.getElementById('codesuivi').value.trim().toUpperCase();
            const resultatSection = document.getElementById('resultatSuivi');
            const aucunResultatSection = document.getElementById('aucunResultat');
            
            // Hide both sections first
            resultatSection.classList.add('hidden');
            aucunResultatSection.classList.add('hidden');
            
            if (!code) {
                alert('Veuillez entrer un code de suivi');
                return;
            }
            
            // Appel AJAX vers l'API
            fetch('/api/suivi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code })
            })
            .then(response => response.json())
            .then(data => {
                if (data.statut === 'succès') {
                    // Afficher les résultats
                    document.getElementById('trackingCode').textContent = code;
                    document.getElementById('expediteur').textContent = data.data.expediteur || 'Non spécifié';
                    document.getElementById('destinataire').textContent = data.data.destinataire || 'Non spécifié';
                    document.getElementById('poids').textContent = '2.5 kg'; // Valeur par défaut
                    document.getElementById('dateEnvoi').textContent = new Date().toLocaleDateString('fr-FR');
                    
                    // Définir le badge de statut
                    const statusBadge = document.getElementById('statusBadge');
                    statusBadge.textContent = data.data.etat;
                    statusBadge.className = 'inline-block px-6 py-3 rounded-full font-semibold text-lg ';
                    
                    if (data.data.etat === 'ARRIVE') {
                        statusBadge.className += 'bg-emerald text-white';
                    } else if (data.data.etat === 'EN_COURS') {
                        statusBadge.className += 'bg-coral text-white';
                    } else {
                        statusBadge.className += 'bg-golden text-white';
                    }
                    
                    // Timeline simple
                    const timeline = document.getElementById('timeline');
                    timeline.innerHTML = `
                        <div class="timeline-item flex items-start">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center status-completed mr-6">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-semibold text-charcoal">Colis expédié</h4>
                                <p class="text-medium-gray">Dakar, Sénégal</p>
                                <p class="text-sm text-medium-gray mt-1">${new Date().toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>
                        <div class="timeline-item flex items-start">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center status-current mr-6">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-lg font-semibold text-charcoal">${data.data.message}</h4>
                                <p class="text-medium-gray">Transport ${data.data.type_cargaison}</p>
                                <p class="text-sm text-medium-gray mt-1">En cours</p>
                            </div>
                        </div>
                    `;
                    
                    resultatSection.classList.remove('hidden');
                    resultatSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Afficher "aucun résultat"
                    aucunResultatSection.classList.remove('hidden');
                    aucunResultatSection.scrollIntoView({ behavior: 'smooth' });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                aucunResultatSection.classList.remove('hidden');
                aucunResultatSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        function resetSearch() {
            document.getElementById('codesuivi').value = '';
            document.getElementById('resultatSuivi').classList.add('hidden');
            document.getElementById('aucunResultat').classList.add('hidden');
            document.getElementById('codesuivi').focus();
        }

        // Allow Enter key to trigger search
        document.getElementById('codesuivi').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                suivreColis();
            }
        });
    </script>
</body>
</html>

