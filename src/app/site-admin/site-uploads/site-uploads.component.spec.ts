import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteUploadsComponent } from './site-uploads.component';

describe('SiteUploadsComponent', () => {
  let component: SiteUploadsComponent;
  let fixture: ComponentFixture<SiteUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
