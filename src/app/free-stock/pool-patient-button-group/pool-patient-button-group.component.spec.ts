import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolPatientButtonGroupComponent } from './pool-patient-button-group.component';

describe('PoolPatientButtonGroupComponent', () => {
  let component: PoolPatientButtonGroupComponent;
  let fixture: ComponentFixture<PoolPatientButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoolPatientButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolPatientButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
