import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderHistoryComponent } from './list-order-history.component';

describe('ListOrderHistoryComponent', () => {
  let component: ListOrderHistoryComponent;
  let fixture: ComponentFixture<ListOrderHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOrderHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
