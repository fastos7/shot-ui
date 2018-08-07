import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDeliveryLocationsComponent } from './display-delivery-locations.component';

describe('DisplayDeliveryLocationsComponent', () => {
  let component: DisplayDeliveryLocationsComponent;
  let fixture: ComponentFixture<DisplayDeliveryLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDeliveryLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDeliveryLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
