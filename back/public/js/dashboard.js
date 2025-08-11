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
