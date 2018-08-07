import { Component, OnInit, Input } from '@angular/core';
import { NewsFeedItem } from '../../common/model/news-feed-item.model';
import { NewsFeedService } from './news-feed.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AlertService } from '../../core/services/alert.service';
import { EventBusService } from '../../common/services/event-bus.service';
import { Constants } from '../../common/app.constants';
import { MatDialog } from '@angular/material';
import { DeleteNewsFeedComponent } from '../delete-news-feed/delete-news-feed.component';

@Component({
  selector: 'app-site-news-feed',
  templateUrl: './site-news-feed.component.html',
  styleUrls: ['./site-news-feed.component.css']
})
export class SiteNewsFeedComponent implements OnInit, OnDestroy {
  @Input('newsFeeds') newsFeeds: NewsFeedItem[];
  @Input('newsFeed') newsFeed: NewsFeedItem;

  constructor(private newsFeedService: NewsFeedService,
              private eventBusService: EventBusService,
              private alertService: AlertService,
              private deleteDialog: MatDialog) { }

  ngOnInit() {
    if (this.newsFeed) {
      this.alertService.success('News Feed is successfully published');
    }
  }

  onAddNewsFeed() {
    this.alertService.reset();
    this.newsFeedService.triggerAddEditNewsFeed(null);
  }

  onViewNewsFeed(newsFeed: NewsFeedItem) {
    this.alertService.reset();
    this.newsFeedService.triggerViewNewsFeed(newsFeed);
  }

  onEditNewsFeed(newsFeed: NewsFeedItem) {
    this.alertService.reset();
    this.newsFeedService.triggerAddEditNewsFeed(newsFeed);
  }

  onDeleteNewsFeed(newsFeed: NewsFeedItem) {
    this.alertService.reset();
    let deleteDialogRef = this.deleteDialog.open(DeleteNewsFeedComponent, {
      width: '400px', data: newsFeed
    });
  }

  ngOnDestroy() {
  }
}
