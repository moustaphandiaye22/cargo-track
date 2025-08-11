/**
 * Classe de validation des formulaires
 * Responsabilité : Valider les champs et gérer les erreurs de saisie
 */
class FormValidator {
    constructor() {
        this.setupValidation();
    }

 
    setupValidation() {
        document.querySelectorAll('input[required], select[required]').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }

   
    validateField(field) {
        const errorSpan = field.parentNode.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }

        if (field.value.trim() && isValid) {
            switch (field.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Format email invalide';
                    }
                    break;
                case 'tel':
                    if (!/^[+]?[0-9\s\-()]{8,}$/.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Format téléphone invalide (min 8 chiffres)';
                    }
                    break;
                case 'number':
                    if (field.hasAttribute('min') && parseFloat(field.value) < parseFloat(field.getAttribute('min'))) {
                        isValid = false;
                        errorMessage = `Valeur minimum : ${field.getAttribute('min')}`;
                    }
                    break;
                case 'date':
                    if (field.value && new Date(field.value) < new Date('1900-01-01')) {
                        isValid = false;
                        errorMessage = 'Date invalide';
                    }
                    break;
            }

            if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
                isValid = false;
                errorMessage = `Minimum ${field.getAttribute('minlength')} caractères`;
            }

            if (field.hasAttribute('maxlength') && field.value.length > parseInt(field.getAttribute('maxlength'))) {
                isValid = false;
                errorMessage = `Maximum ${field.getAttribute('maxlength')} caractères`;
            }
        }

        this.showFieldError(field, errorSpan, isValid, errorMessage);
        return isValid;
    }

   
    showFieldError(field, errorSpan, isValid, message) {
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-light-gray');
            if (errorSpan) {
                errorSpan.classList.add('hidden');
                errorSpan.textContent = '';
            }
        } else {
            field.classList.add('border-red-500');
            field.classList.remove('border-light-gray');
            if (errorSpan) {
                errorSpan.classList.remove('hidden');
                errorSpan.textContent = message;
            }
        }
    }

   
    clearError(field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-light-gray');
        const errorSpan = field.parentNode.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.classList.add('hidden');
        }
    }

   
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

   
    showMessage(type, message, containerId = 'form-messages') {
        const messagesDiv = document.getElementById(containerId);
        const successDiv = document.getElementById('success-message');
        const errorDiv = document.getElementById('error-message');

        if (!messagesDiv || !successDiv || !errorDiv) return;

        // Cacher tous les messages
        successDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        if (type === 'success') {
            successDiv.querySelector('span').textContent = message;
            successDiv.classList.remove('hidden');
        } else {
            errorDiv.querySelector('span').textContent = message;
            errorDiv.classList.remove('hidden');
        }

        messagesDiv.classList.remove('hidden');

        if (type === 'error') {
            setTimeout(() => {
                messagesDiv.classList.add('hidden');
            }, 5000);
        }
    }

  
    clearMessages(containerId = 'form-messages') {
        const messagesDiv = document.getElementById(containerId);
        if (messagesDiv) {
            messagesDiv.classList.add('hidden');
        }
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
