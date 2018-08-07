import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDayComponent } from './display-day.component';

describe('DisplayDayComponent', () => {
  let component: DisplayDayComponent;
  let fixture: ComponentFixture<DisplayDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
