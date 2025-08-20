/**
 * Classe pour la gestion des modales
 * Responsabilité : Ouvrir, fermer et gérer les modales
 */
class ModalManager {
    constructor() {
        this.setupModalEvents();
    }

    setupModalEvents() {
        // Fermer les modales en cliquant à l'extérieur
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Gérer la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID '${modalId}' not found`);
            return;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Reset form and messages when opening
        this.resetModalContent(modal);
        
        // Focus sur le premier champ
        const firstInput = modal.querySelector('input:not([readonly]), select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
    }

  
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID '${modalId}' not found`);
            return;
        }

        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // Restaurer le scroll du body
        document.body.style.overflow = '';
    }

  
    closeAllModals() {
        document.querySelectorAll('.modal.flex').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    resetModalContent(modal) {
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            
            // Effacer les erreurs de validation
            form.querySelectorAll('.error-message').forEach(error => {
                error.classList.add('hidden');
                error.textContent = '';
            });
            
            // Remettre les bordures normales
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.classList.remove('border-red-500');
                field.classList.add('border-light-gray');
            });
        }
        
        // Reset messages
        const messages = modal.querySelector('#form-messages');
        if (messages) {
            messages.classList.add('hidden');
            messages.querySelectorAll('.hidden').forEach(msg => {
                msg.classList.add('hidden');
            });
        }

        // Reset compatibility display
        const compatibility = modal.querySelector('#transport-compatibility');
        if (compatibility) {
            compatibility.className = 'text-xs p-2 bg-light-gray rounded text-medium-gray';
            compatibility.textContent = 'Sélectionnez un type et une cargaison pour voir la compatibilité';
        }
    }

    isModalOpen(modalId) {
        const modal = document.getElementById(modalId);
        return modal && modal.classList.contains('flex');
    }

  
    toggleModal(modalId) {
        if (this.isModalOpen(modalId)) {
            this.closeModal(modalId);
        } else {
            this.openModal(modalId);
        }
    }

    onModalOpen(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('modalopen', callback);
        }
    }

    onModalClose(modalId, callback) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('modalclose', callback);
        }
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
} else if (typeof window !== 'undefined') {
    // Exposer globalement pour les modules ES6
    window.ModalManager = ModalManager;
}

// Export ES6 pour les modules modernes
export default ModalManager;
export { ModalManager };
