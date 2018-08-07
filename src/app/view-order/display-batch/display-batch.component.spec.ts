import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBatchComponent } from './display-batch.component';

describe('DisplayBatchComponent', () => {
  let component: DisplayBatchComponent;
  let fixture: ComponentFixture<DisplayBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
