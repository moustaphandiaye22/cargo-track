export class ColisService {
    constructor(colis) {
        this.colis = colis;
    }
    getInfo() {
        return `Informations du colis: ${this.colis.getCode()}`;
    }
}
