import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPatientCardComponent } from './display-patient-card.component';

describe('DisplayPatientCardComponent', () => {
  let component: DisplayPatientCardComponent;
  let fixture: ComponentFixture<DisplayPatientCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPatientCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPatientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
