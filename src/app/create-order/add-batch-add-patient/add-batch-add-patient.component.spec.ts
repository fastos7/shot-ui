import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchAddPatientComponent } from './add-batch-add-patient.component';

describe('AddBatchAddPatientComponent', () => {
  let component: AddBatchAddPatientComponent;
  let fixture: ComponentFixture<AddBatchAddPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBatchAddPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBatchAddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
