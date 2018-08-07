import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMyOrdersComponent } from './display-my-orders.component';

describe('DisplayMyOrdersComponent', () => {
  let component: DisplayMyOrdersComponent;
  let fixture: ComponentFixture<DisplayMyOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayMyOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayMyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
