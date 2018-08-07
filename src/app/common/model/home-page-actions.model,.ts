export class HomePageActions {
    id: number;
    webPageUrl: string;
    webPageName: string;
    iconName: string; 

    constructor( id: number, webPageUrl: string, webPageName: string, iconName: string) {
        this.id = id;
        this.webPageUrl = webPageUrl;
        this.webPageName = webPageName;
        this.iconName =iconName; 
    }
}