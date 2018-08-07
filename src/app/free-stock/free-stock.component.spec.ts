import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStockComponent } from './free-stock.component';

describe('FreeStockComponent', () => {
  let component: FreeStockComponent;
  let fixture: ComponentFixture<FreeStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
