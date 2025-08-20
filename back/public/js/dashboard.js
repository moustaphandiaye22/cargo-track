/**
 * Classe principale pour la gestion du dashboard
 * Responsabilité : Orchestrer les composants et gérer la logique spécifique au dashboard
 */
class Dashboard {
    constructor() {
        this.init();
    }
   
    init() {
        
        this.setupTabNavigation();
        this.setupLogout();
        this.setupDateDefaults();
        this.setupTableSearch();
        this.setupEtatChange();
        this.setupEtatGlobalChange();
    }

    setupEtatChange() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-etat-change')) {
                // Trouver le conteneur parent commun
                const container = e.target.closest('td');
                if (!container) {
                    console.error('Conteneur parent non trouvé');
                    return;
                }
                
                // Trouver le select et le bouton
                const select = container.querySelector('.etat-select');
                const button = e.target;
                
                if (!select) {
                    console.error('Select non trouvé');
                    return;
                }
                
                const code = button.getAttribute('data-code');
                const nouvelEtat = select.value;
                
                if (!code || !nouvelEtat) {
                    alert('Veuillez choisir un état.');
                    return;
                }
                
                button.disabled = true;
                const originalText = button.textContent;
                button.textContent = '...';
                
                try {
                    const response = await fetch('/api/colis/changer-etat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, etat: nouvelEtat })
                    });
                    
                    const result = await response.json();
                    
                    if (result.statut === 'succès') {
                        // Met à jour dynamiquement la ligne du colis
                        const row = button.closest('tr');
                        if (row) {
                            // Met à jour le badge d'état
                            const etatSpan = row.querySelector('td:nth-child(5) span'); // 5ème colonne (état)
                            if (etatSpan) {
                                let etatClass = 'bg-medium-gray';
                                let etatText = nouvelEtat;
                                
                                switch (nouvelEtat) {
                                    case 'EN_ATTENTE':
                                        etatClass = 'bg-golden';
                                        etatText = 'En Attente';
                                        break;
                                    case 'EN_COURS':
                                        etatClass = 'bg-coral';
                                        etatText = 'En Transit';
                                        break;
                                    case 'ARRIVE':
                                        etatClass = 'bg-emerald';
                                        etatText = 'Arrivé';
                                        break;
                                    case 'RECUPERE':
                                        etatClass = 'bg-blue-500';
                                        etatText = 'Récupéré';
                                        break;
                                    case 'PERDU':
                                        etatClass = 'bg-red-500';
                                        etatText = 'Perdu';
                                        break;
                                    case 'ARCHIVE':
                                        etatClass = 'bg-gray-500';
                                        etatText = 'Archivé';
                                        break;
                                    case 'ANNULE':
                                        etatClass = 'bg-gray-700';
                                        etatText = 'Annulé';
                                        break;
                                    default:
                                        etatClass = 'bg-medium-gray';
                                        etatText = nouvelEtat.charAt(0) + nouvelEtat.slice(1).toLowerCase().replace('_', ' ');
                                }
                                
                                etatSpan.className = `px-3 py-1 ${etatClass} text-white rounded-full text-sm`;
                                etatSpan.textContent = etatText;
                            }
                        }
                        
                        // Message de confirmation
                        const msg = document.createElement('div');
                        msg.textContent = 'État du colis mis à jour !';
                        msg.className = 'fixed top-4 right-4 bg-emerald text-white px-4 py-2 rounded shadow-lg z-50';
                        document.body.appendChild(msg);
                        setTimeout(() => msg.remove(), 2000);
                    } else {
                        alert(result.message || 'Erreur lors du changement d\'état');
                    }
                } catch (err) {
                    console.error('Erreur:', err);
                    alert('Erreur serveur ou réseau');
                } finally {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }
        });
    }
    
    setupEtatGlobalChange() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-etat-global-change')) {
                // Trouver le conteneur parent commun
                const container = e.target.closest('td');
                if (!container) {
                    console.error('Conteneur parent non trouvé');
                    return;
                }
                
                // Trouver le select et le bouton
                const select = container.querySelector('.etat-global-select');
                const button = e.target;
                
                if (!select) {
                    console.error('Select non trouvé');
                    return;
                }
                
                const id = button.getAttribute('data-id');
                const nouvelEtat = select.value;
                
                if (!id || !nouvelEtat) {
                    alert('Veuillez choisir un état.');
                    return;
                }
                
                button.disabled = true;
                const originalText = button.textContent;
                button.textContent = '...';
                
                try {
                    const response = await fetch('/api/cargaison/changer-etat-global', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: parseInt(id), etat: nouvelEtat })
                    });
                    
                    const result = await response.json();
                    
                    if (result.statut === 'succès') {
                        // Message de confirmation
                        const msg = document.createElement('div');
                        msg.textContent = 'État global de la cargaison mis à jour !';
                        msg.className = 'fixed top-4 right-4 bg-emerald text-white px-4 py-2 rounded shadow-lg z-50';
                        document.body.appendChild(msg);
                        setTimeout(() => msg.remove(), 2000);
                        
                        // Recharger la page pour afficher les changements
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        alert(result.message || 'Erreur lors du changement d\'état');
                    }
                } catch (err) {
                    console.error('Erreur:', err);
                    alert('Erreur serveur ou réseau');
                } finally {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }
        });
    }

    setupTabNavigation() {
        // La fonction showTab sera appelée directement depuis le HTML
        window.showTab = (tabName) => {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active', 'text-coral', 'border-b-2', 'border-coral');
                btn.classList.add('text-medium-gray');
            });
            
            const targetTab = document.getElementById(`tab-${tabName}`);
            if (targetTab) {
                targetTab.classList.remove('hidden');
            }
            
            if (event && event.target) {
                event.target.classList.add('active', 'text-coral', 'border-b-2', 'border-coral');
                event.target.classList.remove('text-medium-gray');
            }
        };
    }

   
    setupLogout() {
        window.seDeconnecter = () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                window.location.href = '/logout';
            }
        };
    }

    
    setupDateDefaults() {
        const today = new Date().toISOString().split('T')[0];
        
        document.querySelectorAll('input[name="dateCreation"]').forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const departInput = document.querySelector('input[name="datedepart"]');
        const arriveInput = document.querySelector('input[name="datedarrive"]');
        
        if (departInput && !departInput.value) {
            departInput.value = today;
        }
        
        if (arriveInput && !arriveInput.value) {
            arriveInput.value = nextWeekStr;
        }

        // Mise à jour automatique de la date d'arrivée quand on change la date de départ
        if (departInput && arriveInput) {
            departInput.addEventListener('change', () => {
                const departDate = new Date(departInput.value);
                if (departDate && !isNaN(departDate)) {
                    departDate.setDate(departDate.getDate() + 7);
                    arriveInput.value = departDate.toISOString().split('T')[0];
                }
            });
        }
    }

    exposeGlobalFunctions() {
        // Fonctions pour les modales
        window.openModal = (modalId) => this.modalManager.openModal(modalId);
        window.closeModal = (modalId) => this.modalManager.closeModal(modalId);
        
        
    }

   
    updateStats() {
        
        console.log('Mise à jour des statistiques...');
    }

    filterTable(tableId, searchValue) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchValue.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    setupTableSearch() {
        // Recherche pour les cargaisons - recherche avancée
        const setupCargaisonSearch = () => {
            const btnRechercher = document.getElementById('btn-rechercher');
            const btnEffacer = document.getElementById('btn-effacer');
            
            if (btnRechercher) {
                btnRechercher.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.filterCargaisons();
                });
            }
            
            if (btnEffacer) {
                btnEffacer.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Effacer les champs de recherche
                    document.getElementById('search-code').value = '';
                    document.getElementById('search-depart').value = '';
                    document.getElementById('search-arrivee').value = '';
                    document.getElementById('search-type').value = '';
                    document.getElementById('search-date').value = '';
                    
                    // Réafficher toutes les lignes
                    this.filterTable('table-cargaisons', '');
                });
            }
        };
        
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupCargaisonSearch);
        } else {
            setupCargaisonSearch();
        }
        
        // Recherche pour les colis
        const setupColisSearch = () => {
            const colisSearch = document.querySelector('#tab-colis input[type="text"]');
            if (colisSearch) {
                colisSearch.addEventListener('input', (e) => {
                    this.filterTable('table-colis', e.target.value);
                });
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupColisSearch);
        } else {
            setupColisSearch();
        }

        // Recherche pour les clients
        const setupClientSearch = () => {
            const clientSearch = document.querySelector('#tab-clients input[type="text"]');
            if (clientSearch) {
                clientSearch.addEventListener('input', (e) => {
                    this.filterTable('table-clients', e.target.value);
                });
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupClientSearch);
        } else {
            setupClientSearch();
        }
    }
    
    filterCargaisons() {
        const code = document.getElementById('search-code').value.toLowerCase();
        const depart = document.getElementById('search-depart').value.toLowerCase();
        const arrivee = document.getElementById('search-arrivee').value.toLowerCase();
        const type = document.getElementById('search-type').value;
        const date = document.getElementById('search-date').value;
        
        const table = document.getElementById('table-cargaisons');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            // Récupérer les données de la ligne à partir des attributs data
            const rowData = {
                code: row.getAttribute('data-code')?.toLowerCase() || '',
                type: row.getAttribute('data-type')?.toLowerCase() || '',
                depart: row.getAttribute('data-depart')?.toLowerCase() || '',
                arrivee: row.getAttribute('data-arrivee')?.toLowerCase() || '',
                dateDepart: row.getAttribute('data-date-depart') || '',
                dateArrivee: row.getAttribute('data-date-arrivee') || ''
            };
            
            // Vérifier si la ligne correspond aux critères de recherche
            let matches = true;
            
            if (code && !rowData.code.includes(code)) {
                matches = false;
            }
            
            if (depart && !rowData.depart.includes(depart)) {
                matches = false;
            }
            
            if (arrivee && !rowData.arrivee.includes(arrivee)) {
                matches = false;
            }
            
            if (type && rowData.type.toLowerCase() !== type.toLowerCase()) {
                matches = false;
            }
            
            // Filtrer par date (départ ou arrivée)
            if (date) {
                if (rowData.dateDepart !== date && rowData.dateArrivee !== date) {
                    matches = false;
                }
            }
            
            // Afficher ou masquer la ligne
            row.style.display = matches ? '' : 'none';
        });
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else if (typeof window !== 'undefined') {
    // Exposer globalement pour les modules ES6
    window.Dashboard = Dashboard;
}

// Export ES6 pour les modules modernes
export default Dashboard;
export { Dashboard };
