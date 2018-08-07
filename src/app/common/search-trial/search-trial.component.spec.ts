import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTrialComponent } from './search-trial.component';

describe('SearchTrialComponent', () => {
  let component: SearchTrialComponent;
  let fixture: ComponentFixture<SearchTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
