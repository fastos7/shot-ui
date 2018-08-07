import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCustomerPreferencesComponent } from './remove-customer-preferences.component';

describe('DeleteCustomerPreferencesComponent', () => {
  let component: RemoveCustomerPreferencesComponent;
  let fixture: ComponentFixture<RemoveCustomerPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCustomerPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCustomerPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
