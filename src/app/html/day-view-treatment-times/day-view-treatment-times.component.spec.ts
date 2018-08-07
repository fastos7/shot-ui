import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayViewTreatmentTimesComponent } from './day-view-treatment-times.component';

describe('DayViewTreatmentTimesComponent', () => {
  let component: DayViewTreatmentTimesComponent;
  let fixture: ComponentFixture<DayViewTreatmentTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayViewTreatmentTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayViewTreatmentTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
