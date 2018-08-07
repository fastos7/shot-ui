import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserConfirmComponent } from './delete-user-confirm.component';

describe('DeleteUserConfirmComponent', () => {
  let component: DeleteUserConfirmComponent;
  let fixture: ComponentFixture<DeleteUserConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUserConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
