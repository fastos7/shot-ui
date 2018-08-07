import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPatientComponent } from './display-patient.component';

describe('DisplayPatientComponent', () => {
  let component: DisplayPatientComponent;
  let fixture: ComponentFixture<DisplayPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
