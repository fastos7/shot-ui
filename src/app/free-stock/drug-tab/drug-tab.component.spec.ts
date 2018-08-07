import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugTabComponent } from './drug-tab.component';

describe('DrugTabComponent', () => {
  let component: DrugTabComponent;
  let fixture: ComponentFixture<DrugTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
