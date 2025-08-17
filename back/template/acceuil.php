<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CargoTrack - Gestion de Cargaison</title>
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
        .card-hover {
            transition: all 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .btn-gradient {
            background: #FF8C00;
        }
        .btn-gradient:hover {
            background: linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
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
                    <a href="/acceuil" class="text-coral font-semibold border-b-2 border-coral pb-1">
                        <i class="fas fa-home mr-2"></i>Accueil
                    </a>
                    <a href="/suivi" class="text-charcoal hover:text-coral transition-colors duration-300">
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
                <a href="index.html" class="block px-3 py-2 text-coral font-semibold">
                    <i class="fas fa-home mr-2"></i>Accueil
                </a>
                <a href="suivi.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-search mr-2"></i>Suivi Colis
                </a>
                <a href="connexion.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-user-lock mr-2"></i>Connexion
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
                <i class="fas fa-truck mr-4"></i>CargoTrack
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">
                Votre solution complète pour la gestion et le suivi de cargaisons
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/suivi" class="bg-white text-coral px-8 py-4 rounded-full font-semibold text-lg hover:bg-light-gray transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-search mr-2"></i>Suivre un Colis
                </a>
                <a href="#services" class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-info-circle mr-2"></i>Nos Services
                </a>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-charcoal mb-4">Nos Services de Transport</h2>
                <p class="text-xl text-medium-gray">Des solutions adaptées à tous vos besoins logistiques</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Transport Maritime -->
                <div class="card-hover bg-white rounded-2xl p-8 shadow-lg border border-light-gray">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-coral rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-ship text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-charcoal mb-4">Transport Maritime</h3>
                        <p class="text-medium-gray mb-6">Expédition sécurisée par voie maritime pour vos gros volumes avec suivi en temps réel</p>
                        <ul class="text-left space-y-2 mb-6">
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Capacité jusqu'à 50 tonnes
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Assurance tous risques
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Délai 15-30 jours
                            </li>
                        </ul>
                        <button class="btn-gradient text-white px-6 py-3 rounded-full font-semibold transition-all duration-300">
                            En savoir plus
                        </button>
                    </div>
                </div>

                <!-- Transport Aérien -->
                <div class="card-hover bg-white rounded-2xl p-8 shadow-lg border border-light-gray">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-plane text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-charcoal mb-4">Transport Aérien</h3>
                        <p class="text-medium-gray mb-6">Livraison rapide par voie aérienne pour vos colis urgents et précieux</p>
                        <ul class="text-left space-y-2 mb-6">
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Livraison 24-72h
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Suivi GPS en temps réel
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Priorité maximale
                            </li>
                        </ul>
                        <button class="bg-emerald hover:bg-opacity-90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                            En savoir plus
                        </button>
                    </div>
                </div>

                <!-- Transport Routier -->
                <div class="card-hover bg-white rounded-2xl p-8 shadow-lg border border-light-gray">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-golden rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-truck text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-charcoal mb-4">Transport Routier</h3>
                        <p class="text-medium-gray mb-6">Solution économique pour vos envois terrestres avec flexibilité maximale</p>
                        <ul class="text-left space-y-2 mb-6">
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Tarifs compétitifs
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Livraison à domicile
                            </li>
                            <li class="flex items-center text-charcoal">
                                <i class="fas fa-check text-emerald mr-3"></i>
                                Délai 3-7 jours
                            </li>
                        </ul>
                        <button class="bg-golden hover:bg-opacity-90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-light-gray">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-charcoal mb-4">Pourquoi Choisir CargoTrack ?</h2>
                <p class="text-xl text-medium-gray">Des fonctionnalités avancées pour une expérience optimale</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-coral rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-map-marker-alt text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Suivi en Temps Réel</h3>
                    </div>
                    <p class="text-medium-gray">Suivez vos colis en temps réel avec notre système GPS avancé et recevez des notifications automatiques.</p>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-shield-alt text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Assurance Complète</h3>
                    </div>
                    <p class="text-medium-gray">Tous vos envois sont assurés contre les dommages, pertes et vols avec une couverture jusqu'à 100%.</p>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-golden rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-headset text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Support 24h/7j</h3>
                    </div>
                    <p class="text-medium-gray">Notre équipe de support client est disponible 24h/24 et 7j/7 pour répondre à toutes vos questions.</p>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-sunset rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-dollar-sign text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Tarification Transparente</h3>
                    </div>
                    <p class="text-medium-gray">Aucun frais caché. Nos tarifs sont clairs et compétitifs avec un devis gratuit en ligne.</p>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-coral rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-mobile-alt text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Application Mobile</h3>
                    </div>
                    <p class="text-medium-gray">Gérez vos envois depuis votre smartphone avec notre application mobile intuitive.</p>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg card-hover">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-globe text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal">Réseau International</h3>
                    </div>
                    <p class="text-medium-gray">Expédiez vers plus de 150 pays avec notre réseau de partenaires internationaux de confiance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="gradient-bg text-white py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold mb-6">Prêt à Expédier ?</h2>
            <p class="text-xl mb-8 opacity-90">Rejoignez des milliers de clients satisfaits qui nous font confiance pour leurs envois</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/suivi" class="bg-white text-coral px-8 py-4 rounded-full font-semibold text-lg hover:bg-light-gray transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-search mr-2"></i>Suivre un Colis
                </a>
                <a href="/login" class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-user-plus mr-2"></i>Créer un Compte
                </a>
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
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-coral transition-colors">
                            <i class="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-coral transition-colors">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-coral transition-colors">
                            <i class="fab fa-linkedin text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-coral transition-colors">
                            <i class="fab fa-instagram text-xl"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Services</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Maritime</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Aérien</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Transport Routier</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Entreposage</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Support</h3>
                    <ul class="space-y-2">
                        <li><a href="/suivi" class="text-gray-400 hover:text-coral transition-colors">Suivi de Colis</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">FAQ</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Contact</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-coral transition-colors">Réclamations</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-3 text-coral"></i>
                            +221 77 141 12 51
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-3 text-coral"></i>
                            contact@cargotrack.sn
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-3 text-coral"></i>
                            Dakar, Sénégal
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

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>

