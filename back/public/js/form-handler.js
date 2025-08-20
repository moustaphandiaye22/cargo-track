/**
 * Classe pour la gestion des soumissions de formulaires
 * Responsabilité : Gérer les envois AJAX, les réponses et les états de chargement
 */
class FormHandler {
    constructor(validator) {
        this.validator = validator;
        this.setupFormHandlers();
    }

    /**
     * Configure les gestionnaires de soumission de formulaires
     */
    setupFormHandlers() {
        // Gestion du formulaire de colis
        const formColis = document.getElementById('formNouveauColis');
        if (formColis) {
            formColis.addEventListener('submit', (e) => this.handleColisSubmit(e));
        }

        const formCargaison = document.getElementById('formNouvelleCargaison');
        if (formCargaison) {
            formCargaison.addEventListener('submit', (e) => this.handleCargaisonSubmit(e));
        }
    }

    
    async handleColisSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submit-colis-btn');

        if (!this.validator.validateForm(form)) {
            this.validator.showMessage('error', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        this.setLoadingState(submitBtn, true, 'Création...');

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/colis', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.statut === 'succès') {
                this.validator.showMessage('success', `Colis créé avec succès ! Code: ${result.colis.code}`);
                form.reset();
                setTimeout(() => {
                    if (typeof modalManager !== 'undefined') {
                        modalManager.closeModal('modalNouveauColis');
                    }
                    location.reload(); 
                }, 2000);
            } else {
                this.validator.showMessage('error', result.message || 'Erreur lors de la création du colis');
            }
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            this.validator.showMessage('error', 'Erreur de connexion. Veuillez réessayer.');
        } finally {
            // Arrêter l'état de chargement
            this.setLoadingState(submitBtn, false, 'Créer Colis');
        }
    }

   
    async handleCargaisonSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submit-cargaison-btn');

        // Valider le formulaire
        if (!this.validator.validateForm(form)) {
            this.validator.showMessage('error', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        // Démarrer l'état de chargement
        this.setLoadingState(submitBtn, true, 'Création...');

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/cargaison', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.statut === 'succès') {
                this.validator.showMessage('success', `Cargaison créée avec succès ! Numéro: #${result.cargaison.numero}`);
                form.reset();
                setTimeout(() => {
                    if (typeof modalManager !== 'undefined') {
                        modalManager.closeModal('modalNouvelleCargaison');
                    }
                    location.reload(); // Recharger pour voir la nouvelle cargaison
                }, 2000);
            } else {
                this.validator.showMessage('error', result.message || 'Erreur lors de la création de la cargaison');
            }
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            this.validator.showMessage('error', 'Erreur de connexion. Veuillez réessayer.');
        } finally {
            // Arrêter l'état de chargement
            this.setLoadingState(submitBtn, false, 'Créer Cargaison');
        }
    }

    /**
     * Gère l'état de chargement d'un bouton de soumission
     * @param {HTMLElement} button - Le bouton
     * @param {boolean} loading - Si en état de chargement
     * @param {string} text - Le texte à afficher
     */
    setLoadingState(button, loading, text) {
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.fa-spinner');

        if (loading) {
            button.disabled = true;
            if (btnText) btnText.textContent = text;
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) btnText.textContent = text;
            if (spinner) spinner.classList.add('hidden');
        }
    }

   
    async sendRequest(url, options = {}) {
        try {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const mergedOptions = { ...defaultOptions, ...options };
            
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            throw error;
        }
    }

  
    async submitFormData(url, formData) {
        return this.sendRequest(url, {
            method: 'POST',
            body: formData
        });
    }

    
    async validateAndSubmit(form, url, submitBtn, loadingText, defaultText) {
        // Valider le formulaire
        if (!this.validator.validateForm(form)) {
            this.validator.showMessage('error', 'Veuillez corriger les erreurs dans le formulaire');
            return false;
        }

        // Démarrer l'état de chargement
        this.setLoadingState(submitBtn, true, loadingText);

        try {
            const formData = new FormData(form);
            const result = await this.submitFormData(url, formData);
            return result;
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            this.validator.showMessage('error', 'Erreur de connexion. Veuillez réessayer.');
            return false;
        } finally {
            this.setLoadingState(submitBtn, false, defaultText);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
} else if (typeof window !== 'undefined') {
    // Exposer globalement pour les modules ES6
    window.FormHandler = FormHandler;
}

// Export ES6 pour les modules modernes
export default FormHandler;
export { FormHandler };
