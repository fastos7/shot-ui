import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../core/services/alert.service';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';
import { NewsFeed } from '../../common/model/news-feed.model';
import { NewsFeedService } from '../site-news-feed/news-feed.service';
import { NewsFeedItem } from '../../common/model/news-feed-item.model';

@Component({
  selector: 'app-delete-news-feed',
  templateUrl: './delete-news-feed.component.html',
  styleUrls: ['./delete-news-feed.component.css'],
  providers: [
    AlertService
  ]
})
export class DeleteNewsFeedComponent implements OnInit {
  private newsFeed: NewsFeedItem;
  private newsFeedDeleted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteNewsFeedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewsFeedItem,
    private newsFeedService: NewsFeedService,
    private alertService: AlertService,
    private eventBusService: EventBusService) {
    this.newsFeed = this.data;
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  onDeleteNewsFeed() {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.newsFeedService.deleteNewsFeed(this.newsFeed).subscribe(
      (success) => {
        this.newsFeedDeleted = true;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.alertService.success('News Feed was successfully removed');
        this.newsFeedService.triggerDeleteNewsFeed(this.newsFeed);
      },
      error => {
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
      }
    );

  }

}
