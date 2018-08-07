import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsFeedService } from '../site-news-feed/news-feed.service';
import { AlertService } from '../../core/services/alert.service';
import { Constants } from '../../common/app.constants';
import { NewsFeedItem } from '../../common/model/news-feed-item.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-site-admin-tabs',
  templateUrl: './site-admin-tabs.component.html',
  styleUrls: ['./site-admin-tabs.component.css']
})
export class SiteAdminTabsComponent implements OnInit, OnDestroy {
  private newsFeeds: NewsFeedItem[] = [];
  private newsFeed: NewsFeedItem;

  private newsFeedAddedSubscription: Subscription;
  private newsFeedUpdatedSubscription: Subscription;
  private addEditNewsFeedSubscription: Subscription;
  private deleteNewsFeedSubscription: Subscription;

  private displayNewsFeeds: boolean = true;

  constructor(private newsFeedService: NewsFeedService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.newsFeedService.getAllNewsFeeds().subscribe(
      (newsFeeds: NewsFeedItem[]) => {
        this.newsFeeds = newsFeeds;
        this.newsFeeds.forEach(newsFeed => {
          newsFeed.postedDate = new Date(newsFeed.publishDate);
        });
        this.sortNewsFeeds();
      },
      (error) => {
        if (error.status >= 500) {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        }
      }
    );

    this.newsFeedAddedSubscription = this.newsFeedService.subscribeToAddedNewsFeed().subscribe(
      (addedNewsFeed: NewsFeedItem) => {
        this.newsFeeds.push(addedNewsFeed);
        this.sortNewsFeeds();
        this.showNewsFeeds(true);
        this.newsFeed = addedNewsFeed;
      }
    );

    this.newsFeedUpdatedSubscription = this.newsFeedService.subscribeToUpdatedNewsFeed().subscribe(
      (updatedNewsFeed: NewsFeedItem) => {
        this.newsFeeds.forEach(newsFeed => {
          if (newsFeed.id == updatedNewsFeed.id) {
            newsFeed.header = updatedNewsFeed.header;
            newsFeed.longDesc = updatedNewsFeed.longDesc;
            newsFeed.postedBy = updatedNewsFeed.postedBy;
            newsFeed.postedDate = updatedNewsFeed.postedDate;
            newsFeed.shortDesc = updatedNewsFeed.shortDesc;
          }
        });
        this.sortNewsFeeds();
        this.showNewsFeeds(true);
        this.newsFeed = updatedNewsFeed;
      }
    );

    this.deleteNewsFeedSubscription = this.newsFeedService.subscribeToDeleteNewsFeed().subscribe(
      (deletedNewsFeed: NewsFeedItem) => {
        this.newsFeeds = this.newsFeeds.filter(newsFeed => newsFeed.id != deletedNewsFeed.id);
        this.sortNewsFeeds();
        this.showNewsFeeds(true);
        this.newsFeed = deletedNewsFeed;
      }
    );

    this.addEditNewsFeedSubscription = this.newsFeedService.subscribeToAddEditNewsFeed().subscribe(
      (selectedNewsFeed: NewsFeedItem) => {
        this.newsFeed = Object.assign({}, selectedNewsFeed);
        this.addEditNewsFeed();
      }
    );
  }

  showNewsFeeds(newsFeedAddedUpdated: boolean) {
    if (!newsFeedAddedUpdated) {
      this.newsFeed = null;
    }
    this.displayNewsFeeds = true;
  }

  addEditNewsFeed() {
    this.displayNewsFeeds = false;
  }

  private sortNewsFeeds() {
    this.newsFeeds = this.newsFeeds.sort((newsFeed1: NewsFeedItem, newsFeed2: NewsFeedItem) => {
      if (newsFeed1.postedDate > newsFeed2.postedDate) {
        return -1;
      }
      if (newsFeed1.postedDate < newsFeed2.postedDate) {
        return 1;
      }
      return 0;
    });
  }

  tabChanged(event) {
    this.alertService.reset();
  }

  ngOnDestroy() {
    this.newsFeedAddedSubscription.unsubscribe();
    this.newsFeedUpdatedSubscription.unsubscribe();
    this.addEditNewsFeedSubscription.unsubscribe();
    this.deleteNewsFeedSubscription.unsubscribe();
  }
}
