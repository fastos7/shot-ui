import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOrdersComponent } from './remove-orders.component';

describe('RemoveOrdersComponent', () => {
  let component: RemoveOrdersComponent;
  let fixture: ComponentFixture<RemoveOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
