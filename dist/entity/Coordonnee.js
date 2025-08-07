export class Coordonnee {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    getLatitude() { return this.latitude; }
    ;
    getLongitude() { return this.longitude; }
    ;
    setLatitude(latitude) { this.latitude = latitude; }
    ;
    setLongitude(longitude) { this.longitude = longitude; }
    ;
    distance(autre) {
        const R = 6371; // Rayon de la Terre en kilomètres
        const dLat = (autre.latitude - this.latitude) * Math.PI / 180;
        const dLon = (autre.longitude - this.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.latitude * Math.PI / 180) * Math.cos(autre.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
