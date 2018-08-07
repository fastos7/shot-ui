import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNewsFeedComponent } from './delete-news-feed.component';

describe('DeleteNewsFeedComponent', () => {
  let component: DeleteNewsFeedComponent;
  let fixture: ComponentFixture<DeleteNewsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteNewsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
