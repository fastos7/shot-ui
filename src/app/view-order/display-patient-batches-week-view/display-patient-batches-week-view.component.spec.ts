import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPatientBatchesWeekViewComponent } from './display-patient-batches-week-view.component';

describe('DisplayPatientBatchesWeekViewComponent', () => {
  let component: DisplayPatientBatchesWeekViewComponent;
  let fixture: ComponentFixture<DisplayPatientBatchesWeekViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPatientBatchesWeekViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPatientBatchesWeekViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
