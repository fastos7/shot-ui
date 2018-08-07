import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NewsFeedItem } from '../../common/model/news-feed-item.model';
import { NewsFeedService } from '../site-news-feed/news-feed.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Constants } from '../../common/app.constants';
import { EventBusService } from '../../common/services/event-bus.service';


@Component({
  selector: 'app-create-news-feed',
  templateUrl: './create-news-feed.component.html',
  styleUrls: ['./create-news-feed.component.css']
})
export class CreateNewsFeedComponent implements OnInit, OnDestroy {
  @Input() newsFeed: NewsFeedItem;

  @Output('cancel') cancelEvent: EventEmitter<any> = new EventEmitter();

  private headerErrMsg: string = null;
  private postedByErrMsg: string = null;
  private shortByErrMsg: string = null;
  private longByErrMsg: string = null;
  private shortDesc: string = null;
  private longDesc: string = null;
  private shortDescValid: boolean = true;
  private longDescValid: boolean = true;
  private shortDescModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'align': ['', 'center', 'right', 'justify'] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    ]
  };
  private longDescModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      //[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      //['blockquote', 'code-block'],
      //[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      //[{ 'align': ['', 'center', 'right', 'justify'] }],

      //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'] //'image', 'video']                         // link and image, video
      //[{ 'direction': 'rtl' }],                         // text direction

      //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

      //[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      //['clean'],                                         // remove formatting button
    ]
  };

  private newsFeedForm: FormGroup;

  constructor(private newsFeedService: NewsFeedService,
    private alertService: AlertService,
    private eventBusService: EventBusService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.alertService.reset();
    this.createForm();
  }

  // Create & Initialize NewsFeed Form
  private createForm() {
    this.shortDesc = this.newsFeed ? this.newsFeed.shortDesc : null;
    this.longDesc = this.newsFeed ? this.newsFeed.longDesc : null;
    this.newsFeedForm = this.formBuilder.group({
      header: [this.newsFeed ? this.newsFeed.header : '', Validators.required],
      postedBy: [this.newsFeed ? this.newsFeed.postedBy : '', Validators.required],
      shortDesc: [this.newsFeed ? this.newsFeed.shortDesc : '', Validators.required],
      longDesc: [this.newsFeed ? this.newsFeed.longDesc : '', Validators.required]
    });
  }

  validateHeader() {
    let formControl: FormControl = <FormControl>this.newsFeedForm.get('header');
    if (!formControl.valid && formControl.touched) {
      this.headerErrMsg = 'Heading is required'
      return false;
    }
    this.headerErrMsg = null;
    return true;
  }

  validatePostedBy() {
    let formControl: FormControl = <FormControl>this.newsFeedForm.get('postedBy');
    if (!formControl.valid && formControl.touched) {
      this.postedByErrMsg = 'Posted By is required'
      return false;
    }
    this.postedByErrMsg = null;
    return true;
  }

  onShortDescChanged(obj) {
    let html: string = obj.html;
    if (html == null || html == '') {
      this.shortByErrMsg = 'Short Description is required';
      this.shortDescValid = false;
      return;
    } else if (html.length > 200) {
      this.shortByErrMsg = 'Short Description text cannot be more than 200 characters';
      this.shortDescValid = false;
      return;
    }
    this.shortByErrMsg = null;
    this.shortDescValid = true;
  }

  onLongDescChanged(obj) {
    let html: string = obj.html;
    if (html == null || html == '') {
      this.longByErrMsg = 'Long Description is required';
      this.longDescValid = false;
      return;
    } else if (html.length > 3000) {
      this.longByErrMsg = 'Long Description text cannot be more than 3000 characters';
      this.longDescValid = false;
      return;
    }
    this.longByErrMsg = null;
    this.longDescValid = true;
  }

  onSubmit() {
    if (this.newsFeed == null) {
      this.newsFeed = new NewsFeedItem();
    }
    this.newsFeed.header = this.newsFeedForm.get('header').value;
    this.newsFeed.postedBy = this.newsFeedForm.get('postedBy').value;
    this.newsFeed.shortDesc = this.newsFeedForm.get('shortDesc').value;
    this.newsFeed.longDesc = this.newsFeedForm.get('longDesc').value;

    if (this.newsFeed.id == null) {
      this.publishNewFeed(this.newsFeed);
    } else {
      this.publishExistingFeed(this.newsFeed);
    }
  }


  publishNewFeed(newsFeed: NewsFeedItem) {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.newsFeedService.createNewsFeed(newsFeed).subscribe(
      (newFeed: NewsFeedItem) => {
        newsFeed.id = newFeed.id;
        newsFeed.postedDate = new Date(newFeed.publishDate);
        this.newsFeed = newsFeed;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.newsFeedService.triggerAddedNewsFeed(this.newsFeed);
      },
      error => {
        if (error.status >= 500) {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        }
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      }
    );
  }

  publishExistingFeed(newsFeed: NewsFeedItem) {
    this.eventBusService.broadcast(Constants.SHOW_LOADING);
    this.newsFeedService.updateNewsFeed(newsFeed).subscribe(
      (newFeed: NewsFeedItem) => {
        newsFeed.postedDate = new Date(newFeed.publishDate);
        this.newsFeed = newsFeed;
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
        this.newsFeedService.triggerUpdatedNewsFeed(this.newsFeed);
      },
      error => {
        if (error.status >= 500) {
          this.alertService.error(Constants.GENERIC_ERROR_MESSAGE);
        }
        this.eventBusService.broadcast(Constants.HIDE_LOADING);
      }
    );
  }

  onCancel() {
    this.cancelEvent.emit();
  }

  ngOnDestroy() {
  }
}
