import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NewsFeedItem } from '../../common/model/news-feed-item.model';
import { NewsFeedService } from '../site-news-feed/news-feed.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-view-news-feed',
  templateUrl: './view-news-feed.component.html',
  styleUrls: ['./view-news-feed.component.css']
})
export class ViewNewsFeedComponent implements OnInit, OnDestroy {
  private newsFeed: NewsFeedItem;
  private viewNewsFeedSubscription: Subscription;

  @ViewChild('cancelBtn') cancelBtn: ElementRef;
  @Input() allowEditing: boolean = true;

  constructor(private newsFeedService: NewsFeedService) { }

  ngOnInit() {
    this.viewNewsFeedSubscription = this.newsFeedService.subscribeToViewNewsFeed().subscribe(
      selectedNewsFeed => this.newsFeed = selectedNewsFeed
    );
  }

  onEditNewsFeed(newsFeed: NewsFeedItem) {
    this.newsFeedService.triggerAddEditNewsFeed(newsFeed);
    this.cancelBtn.nativeElement.click();
  }

  ngOnDestroy() {
    this.viewNewsFeedSubscription.unsubscribe();
  }
}
