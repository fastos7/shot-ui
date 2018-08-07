import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBatchActionComponent } from './confirm-batch-action.component';

describe('ConfirmBatchActionComponent', () => {
  let component: ConfirmBatchActionComponent;
  let fixture: ComponentFixture<ConfirmBatchActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmBatchActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBatchActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
