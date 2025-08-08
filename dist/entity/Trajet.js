"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trajet = void 0;
class Trajet {
    constructor(lieuDepart, lieuArrive) {
        this.lieuDepart = lieuDepart;
        this.lieuArrive = lieuArrive;
        this.distance = this.calculDistance();
    }
    getLieuDepart() { return this.lieuDepart; }
    ;
    getLieuArrive() { return this.lieuArrive; }
    ;
    getDistance() { return this.distance; }
    ;
    setDistance(distance) { this.distance = distance; }
    ;
    setLieuDepart(lieuDepart) { this.lieuDepart = lieuDepart; }
    ;
    setLieuArrive(lieuArrive) { this.lieuArrive = lieuArrive; }
    ;
    calculDistance() {
        return this.lieuDepart.distance(this.lieuArrive);
    }
}
exports.Trajet = Trajet;
//# sourceMappingURL=Trajet.js.map