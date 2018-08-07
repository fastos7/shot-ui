import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPatientCardsComponent } from './list-patient-cards.component';

describe('ListPatientCardsComponent', () => {
  let component: ListPatientCardsComponent;
  let fixture: ComponentFixture<ListPatientCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPatientCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPatientCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
