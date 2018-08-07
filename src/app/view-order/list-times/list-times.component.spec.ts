import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTimesComponent } from './list-times.component';

describe('ListTimesComponent', () => {
  let component: ListTimesComponent;
  let fixture: ComponentFixture<ListTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
