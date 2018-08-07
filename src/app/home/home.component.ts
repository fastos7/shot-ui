import { Constants } from '../common/app.constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermissionsService } from '../common/services/user-permissions.service';
import { HomePageActions } from '../common/model/home-page-actions.model,';
import { NewsFeedItem } from '../common/model/news-feed-item.model';
import { NewsFeedService } from '../site-admin/site-news-feed/news-feed.service';
import { AlertService } from '../core/services/alert.service';
import { HomeService } from './home.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newsFeeds: NewsFeedItem[];
  homePageActions: HomePageActions[];

  //constants : any = Constants;  

  constructor(    
    private userPermissionsService: UserPermissionsService,
    private homeService: HomeService,
    private newsFeedService: NewsFeedService,
    private router: Router) {
    this.getNewsFeed();
    this.getHomePageActions();
  }

  ngOnInit() {

  }

  getNewsFeed(): void {
    this.newsFeedService.getAllNewsFeeds().subscribe(
      (newsFeeds: NewsFeedItem[]) => {
        this.newsFeeds = newsFeeds;
        this.newsFeeds.forEach(newsFeed => {
          newsFeed.postedDate = new Date(newsFeed.publishDate);
        });
        this.sortNewsFeeds();
      },
      (error) => {
        this.newsFeeds = [];
        if (error.status >= 500) {
          $('#newsFeeds').hide();
        }
      }
    );
  }

  getHomePageActions(): void {
    this.homeService.getHomePageActions().subscribe(
      (homePageData) => {
        this.homePageActions = homePageData;
      },
      (error) => {
        this.homePageActions = [];
        setTimeout(function () {
          if ($('.landing-item').is(":visible"))
            $('#starthere').show();
          else
            $('#starthere').hide();
        }, 100);
      }
    )
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

  onViewNewsFeed(newsFeed: NewsFeedItem) {
    this.newsFeedService.triggerViewNewsFeed(newsFeed);
  }

  hasPermisson(navigation: string) {
    return this.userPermissionsService.hasPermisson(navigation);
  }

  isPermissionsInitialized(): boolean {
    return this.userPermissionsService.isPermissionsInitialized();
  }
}
