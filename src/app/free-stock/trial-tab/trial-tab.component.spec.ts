import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialTabComponent } from './trial-tab.component';

describe('TrialTabComponent', () => {
  let component: TrialTabComponent;
  let fixture: ComponentFixture<TrialTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
