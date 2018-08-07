import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProductDetailsComponent } from './display-product-details.component';

describe('DisplayProductDetailsComponent', () => {
  let component: DisplayProductDetailsComponent;
  let fixture: ComponentFixture<DisplayProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
