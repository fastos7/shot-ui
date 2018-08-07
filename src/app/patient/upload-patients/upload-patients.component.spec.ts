import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPatientsComponent } from './upload-patients.component';

describe('UploadPatientsComponent', () => {
  let component: UploadPatientsComponent;
  let fixture: ComponentFixture<UploadPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
