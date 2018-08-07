import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserTabComponent } from './create-user-tab.component';

describe('CreateUserTabComponent', () => {
  let component: CreateUserTabComponent;
  let fixture: ComponentFixture<CreateUserTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
