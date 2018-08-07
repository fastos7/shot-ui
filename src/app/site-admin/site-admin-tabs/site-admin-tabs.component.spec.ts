import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAdminTabsComponent } from './site-admin-tabs.component';

describe('SiteAdminTabsComponent', () => {
  let component: SiteAdminTabsComponent;
  let fixture: ComponentFixture<SiteAdminTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAdminTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAdminTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
