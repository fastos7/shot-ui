import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserSitesCardComponent } from './search-user-sites-card.component';

describe('SearchUserSitesCardComponent', () => {
  let component: SearchUserSitesCardComponent;
  let fixture: ComponentFixture<SearchUserSitesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUserSitesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserSitesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
