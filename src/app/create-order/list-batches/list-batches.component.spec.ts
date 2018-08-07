import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBatchesComponent } from './list-batches.component';

describe('ListBatchesComponent', () => {
  let component: ListBatchesComponent;
  let fixture: ComponentFixture<ListBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
