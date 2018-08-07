import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsFeedComponent } from './create-news-feed.component';

describe('CreateNewsFeedComponent', () => {
  let component: CreateNewsFeedComponent;
  let fixture: ComponentFixture<CreateNewsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
