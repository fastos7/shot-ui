import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomerPreferencesComponent } from './list-customer-preferences.component';

describe('ListCustomerPreferencesComponent', () => {
  let component: ListCustomerPreferencesComponent;
  let fixture: ComponentFixture<ListCustomerPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomerPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomerPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
