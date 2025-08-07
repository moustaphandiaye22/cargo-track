export class Trajet {
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
