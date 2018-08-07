import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserCardComponent } from './search-user-card.component';

describe('SearchUserCardComponent', () => {
  let component: SearchUserCardComponent;
  let fixture: ComponentFixture<SearchUserCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUserCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
