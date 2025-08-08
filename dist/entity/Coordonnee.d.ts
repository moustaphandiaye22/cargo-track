export declare class Coordonnee {
    private latitude;
    private longitude;
    constructor(latitude: number, longitude: number);
    getLatitude(): number;
    getLongitude(): number;
    setLatitude(latitude: number): void;
    setLongitude(longitude: number): void;
    distance(autre: Coordonnee): number;
}
