import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMyOrdersHeaderComponent } from './display-my-orders-header.component';

describe('DisplayMyOrdersHeaderComponent', () => {
  let component: DisplayMyOrdersHeaderComponent;
  let fixture: ComponentFixture<DisplayMyOrdersHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayMyOrdersHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayMyOrdersHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
