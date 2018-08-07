import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteNewsFeedComponent } from './site-news-feed.component';

describe('SiteNewsFeedComponent', () => {
  let component: SiteNewsFeedComponent;
  let fixture: ComponentFixture<SiteNewsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteNewsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteNewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
