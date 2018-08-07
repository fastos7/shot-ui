import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPatientMultipleComponent } from './search-patient-multiple.component';

describe('SearchPatientMultipleComponent', () => {
  let component: SearchPatientMultipleComponent;
  let fixture: ComponentFixture<SearchPatientMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPatientMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatientMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
