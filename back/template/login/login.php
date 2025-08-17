<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Gestionnaire - CargoTrack</title>
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
        .login-card {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
        }
    </style>
</head>
<body class="gradient-bg min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50">
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
                    <a href="/suivi" class="text-charcoal hover:text-coral transition-colors duration-300">
                        <i class="fas fa-search mr-2"></i>Suivi Colis
                    </a>
                    <a href="/login" class="text-coral font-semibold border-b-2 border-coral pb-1">
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
        <div id="mobile-menu" class="hidden md:hidden bg-white bg-opacity-95 backdrop-blur-md border-t">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a href="index.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-home mr-2"></i>Accueil
                </a>
                <a href="suivi.html" class="block px-3 py-2 text-charcoal hover:text-coral">
                    <i class="fas fa-search mr-2"></i>Suivi Colis
                </a>
                <a href="connexion.html" class="block px-3 py-2 text-coral font-semibold">
                    <i class="fas fa-user-lock mr-2"></i>Connexion
                </a>
            </div>
        </div>
    </nav>

    <!-- Login Section -->
    <section class="flex items-center justify-center min-h-screen py-12 px-4">
        <div class="max-w-md w-full">
            <!-- Login Card -->
            <div class="login-card rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
                <div class="text-center mb-8">
                    <div class="w-20 h-20 bg-gradient-to-br from-coral to-sunset rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-user-lock text-white text-3xl"></i>
                    </div>
                    <h2 class="text-3xl font-bold text-charcoal mb-2">Connexion Gestionnaire</h2>
                    <p class="text-medium-gray">Accès réservé au personnel autorisé</p>
                </div>

                <form id="loginForm" method="POST" action="/login" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-semibold text-charcoal mb-2">
                            <i class="fas fa-user mr-2 text-coral"></i>Nom d'utilisateur
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username"
                            placeholder="Entrez votre nom d'utilisateur"
                            class="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-coral focus:outline-none transition-colors duration-300 bg-white bg-opacity-90"  
                        >
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-semibold text-charcoal mb-2">
                            <i class="fas fa-lock mr-2 text-coral"></i>Mot de passe
                        </label>
                        <div class="relative">
                            <input 
                                type="password" 
                                id="password" 
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                class="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-coral focus:outline-none transition-colors duration-300 bg-white bg-opacity-90 pr-12"
                            >
                            <button 
                                type="button" 
                                id="togglePassword"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium-gray hover:text-coral transition-colors duration-300"
                            >
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" class="rounded border-light-gray text-coral focus:ring-coral focus:ring-2">
                            <span class="ml-2 text-sm text-charcoal">Se souvenir de moi</span>
                        </label>
                        <a href="#" class="text-sm text-coral hover:underline">Mot de passe oublié ?</a>
                    </div>

                    <button 
                        type="submit" 
                        class="w-full btn-gradient text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                    >
                        <i class="fas fa-sign-in-alt mr-2"></i>Se Connecter
                    </button>
                </form>

                <div class="mt-8 text-center">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-light-gray"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-medium-gray">Ou</span>
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <p class="text-sm text-medium-gray">
                            Pas encore de compte gestionnaire ? 
                            <a href="#" class="text-coral hover:underline font-semibold">Contactez l'administrateur</a>
                        </p>
                    </div>
                </div>
            </div>

            
        </div>
    </section>

    
   

    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });

        // Password visibility toggle
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });

        // Afficher un message d'erreur si présent
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error')) {
            showMessage('Nom d\'utilisateur ou mot de passe incorrect', 'error');
        }

        function showMessage(message, type) {
            // Remove existing messages
            const existingMessage = document.querySelector('.message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold text-white z-50 transition-all duration-300 ${
                type === 'success' ? 'bg-emerald' : 'bg-coral'
            }`;
            messageDiv.textContent = message;
            
            document.body.appendChild(messageDiv);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateX(100%)';
                setTimeout(() => messageDiv.remove(), 300);
            }, 3000);
        }


    </script>
</body>
</html>

