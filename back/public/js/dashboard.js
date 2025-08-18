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
    }

        setupEtatChange() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-etat-change')) {
                const code = e.target.getAttribute('data-code');
                const select = e.target.parentElement.querySelector('.etat-select');
                const nouvelEtat = select.value;
                if (!code || !nouvelEtat) {
                    alert('Veuillez choisir un état.');
                    return;
                }
                e.target.disabled = true;
                e.target.textContent = '...';
                try {
                    const response = await fetch('/api/colis/changer-etat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, etat: nouvelEtat })
                    });
                    const result = await response.json();
                    if (result.statut === 'succès') {
                        // Met à jour dynamiquement la ligne du colis
                        const row = e.target.closest('tr');
                        if (row) {
                            // Met à jour le badge d'état
                            const etatSpan = row.querySelector('td span');
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
                                    default:
                                        etatClass = 'bg-medium-gray';
                                        etatText = nouvelEtat.charAt(0) + nouvelEtat.slice(1).toLowerCase().replace('_', ' ');
                                }
                                etatSpan.className = `px-3 py-1 ${etatClass} text-white rounded-full text-sm`;
                                etatSpan.textContent = etatText;
                            }
                        }
                        // Message de confirmation
                        e.target.textContent = 'Valider';
                        e.target.disabled = false;
                        const msg = document.createElement('div');
                        msg.textContent = 'État du colis mis à jour !';
                        msg.className = 'fixed top-4 right-4 bg-emerald text-white px-4 py-2 rounded shadow-lg z-50';
                        document.body.appendChild(msg);
                        setTimeout(() => msg.remove(), 2000);
                    } else {
                        alert(result.message || 'Erreur lors du changement d\'état');
                    }
                } catch (err) {
                    alert('Erreur serveur ou réseau');
                } finally {
                    e.target.disabled = false;
                    if (e.target.textContent !== 'Valider') e.target.textContent = 'Valider';
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
        // Recherche pour les cargaisons
        const cargaisonSearch = document.querySelector('#tab-cargaisons input[type="text"]');
        if (cargaisonSearch) {
            cargaisonSearch.addEventListener('input', (e) => {
                this.filterTable('table-cargaisons', e.target.value);
            });
        }

        // Recherche pour les colis
        const colisSearch = document.querySelector('#tab-colis input[type="text"]');
        if (colisSearch) {
            colisSearch.addEventListener('input', (e) => {
                this.filterTable('table-colis', e.target.value);
            });
        }

        // Recherche pour les clients
        const clientSearch = document.querySelector('#tab-clients input[type="text"]');
        if (clientSearch) {
            clientSearch.addEventListener('input', (e) => {
                this.filterTable('table-clients', e.target.value);
            });
        }
    }
}
