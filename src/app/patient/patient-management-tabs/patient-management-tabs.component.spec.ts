import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientManagementTabsComponent } from './patient-management-tabs.component';

describe('PatientManagementTabsComponent', () => {
  let component: PatientManagementTabsComponent;
  let fixture: ComponentFixture<PatientManagementTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientManagementTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientManagementTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
