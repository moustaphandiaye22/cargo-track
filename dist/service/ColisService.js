"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColisService = void 0;
class ColisService {
    constructor(colis) {
        this.colis = colis;
    }
    getInfo() {
        return `Informations du colis: ${this.colis.getCode()}`;
    }
}
exports.ColisService = ColisService;
//# sourceMappingURL=ColisService.js.map