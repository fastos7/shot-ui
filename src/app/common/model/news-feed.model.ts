export class NewsFeed {
    id: number;
    createdDate: Date;
    header: string;
    message: string;
    postedBy: string; 

    constructor( id: number, createdDate: Date, header: string, message: string, postedBy: string) {
        this.id = id;
        this.createdDate = createdDate;
        this.header = header;
        this.message = message;
        this.postedBy =postedBy; 
    }
}