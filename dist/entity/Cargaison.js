export class Cargaison {
    constructor() {
        this.MAX_PRODUIT = 10;
    }
    getId() { return this.id; }
    getNumero() { return this.numero; }
    getPoidsMax() { return this.poidsMax; }
    getSesproduit() { return this.sesproduit; }
    getPrixtotal() { return this.prixtotal; }
    getDistance() { return this.distance; }
    getType() { return this.type; }
    getEtatAvancement() { return this.etatAvancement; }
    getEtatglobal() { return this.etatglobal; }
    getTrajet() { return this.trajet; }
    getDatedepart() { return this.datedepart; }
    getDatedarrive() { return this.datedarrive; }
    getCoordonne() { return this.coordonne; }
    setId(val) { this.id = val; }
    setNumero(val) { this.numero = val; }
    setPoidsMax(val) { this.poidsMax = val; }
    setSesproduit(val) { this.sesproduit = val; }
    setPrixtotal(val) { this.prixtotal = val; }
    setDistance(val) { this.distance = val; }
    setType(val) { this.type = val; }
    setEtatAvancement(val) { this.etatAvancement = val; }
    setEtatglobal(val) { this.etatglobal = val; }
    setTrajet(val) { this.trajet = val; }
    setDatedepart(val) { this.datedepart = val; }
    setDatedarrive(val) { this.datedarrive = val; }
    setCoordonne(val) { this.coordonne = val; }
    AjouterProduitbase(colis) {
        if (!this.sesproduit) {
            this.sesproduit = [];
        }
        if (this.sesproduit.length >= this.MAX_PRODUIT) {
            console.log("La cargaison est pleine, elle ne peut pas dépasser 10 produits");
            return false;
        }
        this.sesproduit.push(colis);
        console.log('Produit ajouté avec succès');
        return true;
    }
}
