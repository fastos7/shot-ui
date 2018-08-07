import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewsFeedComponent } from './view-news-feed.component';

describe('ViewNewsFeedComponent', () => {
  let component: ViewNewsFeedComponent;
  let fixture: ComponentFixture<ViewNewsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNewsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
