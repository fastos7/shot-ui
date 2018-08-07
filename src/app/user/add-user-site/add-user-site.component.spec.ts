import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserSiteComponent } from './add-user-site.component';

describe('AddUserSiteComponent', () => {
  let component: AddUserSiteComponent;
  let fixture: ComponentFixture<AddUserSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
