/**
 * Classe pour la gestion de la compatibilité transport-produit
 * Responsabilité : Vérifier et afficher la compatibilité entre types de transport et produits
 */
class TransportCompatibility {
    constructor() {
        this.setupCompatibilityCheck();
    }

    /**
     * Configure la vérification de compatibilité en temps réel
     */
    setupCompatibilityCheck() {
        const typeSelect = document.querySelector('select[name="typeproduit"]');
        const cargaisonSelect = document.querySelector('select[name="cargaison_id"]');
        const compatibilityDiv = document.getElementById('transport-compatibility');

        if (typeSelect && cargaisonSelect && compatibilityDiv) {
            const checkCompatibility = () => {
                const selectedType = typeSelect.value;
                const selectedOption = cargaisonSelect.selectedOptions[0];
                
                if (selectedType && selectedOption && selectedOption.value) {
                    const cargaisonType = selectedOption.getAttribute('data-type');
                    const compatibility = this.checkTransportCompatibility(cargaisonType, selectedType);
                    
                    compatibilityDiv.className = `text-xs p-2 rounded ${compatibility.className}`;
                    compatibilityDiv.innerHTML = `<i class="${compatibility.icon}"></i> ${compatibility.message}`;
                } else {
                    this.resetCompatibilityDisplay(compatibilityDiv);
                }
            };

            typeSelect.addEventListener('change', checkCompatibility);
            cargaisonSelect.addEventListener('change', checkCompatibility);
        }
    }
    
    checkTransportCompatibility(cargaisonType, produitType) {
        // Règles métier selon CargaisonService.ts
        if (cargaisonType === 'MARITIME' && produitType === 'FRAGILE') {
            return {
                className: 'bg-red-100 text-red-700 border border-red-300',
                icon: 'fas fa-times-circle',
                message: 'INCOMPATIBLE : Fragile interdit en maritime'
            };
        }
        
        if ((cargaisonType === 'AERIENNE' || cargaisonType === 'ROUTIERE') && produitType === 'CHIMIQUE') {
            return {
                className: 'bg-red-100 text-red-700 border border-red-300',
                icon: 'fas fa-times-circle',
                message: `INCOMPATIBLE : Chimique interdit en ${cargaisonType.toLowerCase()}`
            };
        }

        return {
            className: 'bg-green-100 text-green-700 border border-green-300',
            icon: 'fas fa-check-circle',
            message: 'COMPATIBLE : Transport autorisé'
        };
    }

    resetCompatibilityDisplay(compatibilityDiv) {
        compatibilityDiv.className = 'text-xs p-2 bg-light-gray rounded text-medium-gray';
        compatibilityDiv.textContent = 'Sélectionnez un type et une cargaison pour voir la compatibilité';
    }

    isCompatible(cargaisonType, produitType) {
        const compatibility = this.checkTransportCompatibility(cargaisonType, produitType);
        return !compatibility.className.includes('red');
    }

   
    getCompatibleProductTypes(cargaisonType) {
        const allTypes = ['ALIMENTAIRE', 'CHIMIQUE', 'FRAGILE', 'INCASSABLE', 'MATERIEL', 'AUTRES'];
        
        return allTypes.filter(produitType => 
            this.isCompatible(cargaisonType, produitType)
        );
    }

    getCompatibleTransportTypes(produitType) {
        const allTransports = ['MARITIME', 'AERIENNE', 'ROUTIERE'];
        
        return allTransports.filter(cargaisonType => 
            this.isCompatible(cargaisonType, produitType)
        );
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransportCompatibility;
} else if (typeof window !== 'undefined') {
    // Exposer globalement pour les modules ES6
    window.TransportCompatibility = TransportCompatibility;
}

// Export ES6 pour les modules modernes
export default TransportCompatibility;
export { TransportCompatibility };
