import { Injectable } from "@angular/core";
import { User } from "../../common/model/user.model";
import { Observable } from "rxjs/Observable";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { RestURLBuilder } from "rest-url-builder";
import { Constants } from "../../common/app.constants";
import { Subject } from "rxjs/Subject";
import { first } from "rxjs/operator/first";
import { NewsFeedItem } from "../../common/model/news-feed-item.model";
import { HttpClientService } from "../../common/services/http-client.service";

@Injectable()
export class NewsFeedService {
    private newsFeedViewSubject: Subject<NewsFeedItem> = new Subject<NewsFeedItem>();
    private newsFeedAddEditSubject: Subject<NewsFeedItem> = new Subject<NewsFeedItem>();
    private newsFeedAddedSubject: Subject<NewsFeedItem> = new Subject<NewsFeedItem>();
    private newsFeedUpdatedSubject: Subject<NewsFeedItem> = new Subject<NewsFeedItem>();
    private newsFeedDeleteSubject: Subject<NewsFeedItem> = new Subject<NewsFeedItem>();

    constructor(private http: HttpClientService) { }

    getAllNewsFeeds(): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.NEWS_FEED_API_BASE_URL);
        let uri = builder.get();

        return this.http.get(uri);
    }

    getNewsFeedById(id): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.NEWS_FEED_API_URL);
        builder.setNamedParameter('id', id);
        let uri = builder.get();

        return this.http.get(uri);
    }

    createNewsFeed(newsFeed: NewsFeedItem): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.NEWS_FEED_API_BASE_URL);
        let uri = builder.get();

        return this.http.post(uri, newsFeed);
    }

    /**
     * Updates the existing NewsFeed.
     * @param newsFeed News Feed to be updated.
     */
    updateNewsFeed(newsFeed: NewsFeedItem): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.NEWS_FEED_API_URL);
        builder.setNamedParameter("id", String(newsFeed.id));
        let url: string = builder.get();

        return this.http.put(url, newsFeed);
    }

    /**
     * Delete the existing NewsFeed.
     * @param newsFeed News Feed to be deleted.
     */
    deleteNewsFeed(newsFeed: NewsFeedItem): Observable<any> {
        let builder = new RestURLBuilder().buildRestURL(Constants.NEWS_FEED_API_URL);
        builder.setNamedParameter("id", String(newsFeed.id));
        let url: string = builder.get();

        return this.http.delete(url);
    }

    subscribeToViewNewsFeed(): Observable<NewsFeedItem> {
        return this.newsFeedViewSubject.asObservable();
    }

    triggerViewNewsFeed(newsFeed: NewsFeedItem) {
        this.newsFeedViewSubject.next(newsFeed);
    }

    subscribeToAddEditNewsFeed(): Observable<NewsFeedItem> {
        return this.newsFeedAddEditSubject.asObservable();
    }

    triggerAddEditNewsFeed(newsFeed: NewsFeedItem) {
        this.newsFeedAddEditSubject.next(newsFeed);
    }

    subscribeToAddedNewsFeed(): Observable<NewsFeedItem> {
        return this.newsFeedAddedSubject.asObservable();
    }

    triggerAddedNewsFeed(newsFeed: NewsFeedItem) {
        this.newsFeedAddedSubject.next(newsFeed);
    }

    subscribeToUpdatedNewsFeed(): Observable<NewsFeedItem> {
        return this.newsFeedUpdatedSubject.asObservable();
    }

    triggerUpdatedNewsFeed(newsFeed: NewsFeedItem) {
        this.newsFeedUpdatedSubject.next(newsFeed);
    }

    subscribeToDeleteNewsFeed(): Observable<NewsFeedItem> {
        return this.newsFeedDeleteSubject.asObservable();
    }

    triggerDeleteNewsFeed(newsFeed: NewsFeedItem) {
        this.newsFeedDeleteSubject.next(newsFeed);
    }
}
