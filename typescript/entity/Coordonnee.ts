export class Coordonnee{
    private latitude:number;
    private longitude:number;

    constructor(latitude:number, longitude:number){
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getLatitude():number{return this.latitude; };
    getLongitude():number{return this.longitude; };
    setLatitude(latitude:number):void{this.latitude=latitude; };
    setLongitude(longitude:number):void{this.longitude=longitude; };

    distance(autre: Coordonnee): number {
        const R = 6371; // Rayon de la Terre en kilomètres
        const dLat = (autre.latitude - this.latitude) * Math.PI / 180;
        const dLon = (autre.longitude - this.longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.latitude * Math.PI / 180) * Math.cos(autre.latitude * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}
