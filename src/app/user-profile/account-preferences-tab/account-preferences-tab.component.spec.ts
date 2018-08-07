import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPreferencesTabComponent } from './account-preferences-tab.component';

describe('AccountPreferencesTabComponent', () => {
  let component: AccountPreferencesTabComponent;
  let fixture: ComponentFixture<AccountPreferencesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPreferencesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPreferencesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
