import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCustomerPreferenceComponent } from './display-customer-preference.component';

describe('EditCustomerPreferenceComponent', () => {
  let component: DisplayCustomerPreferenceComponent;
  let fixture: ComponentFixture<DisplayCustomerPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayCustomerPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayCustomerPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
