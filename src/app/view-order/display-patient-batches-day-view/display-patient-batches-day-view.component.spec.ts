import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPatientBatchesDayViewComponent } from './display-patient-batches-day-view.component';

describe('DisplayPatientBatchesDayViewComponent', () => {
  let component: DisplayPatientBatchesDayViewComponent;
  let fixture: ComponentFixture<DisplayPatientBatchesDayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPatientBatchesDayViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPatientBatchesDayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
