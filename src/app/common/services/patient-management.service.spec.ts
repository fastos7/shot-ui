import { TestBed, inject } from '@angular/core/testing';

import { PatientManagementService } from './patient-management.service';

describe('PatientManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientManagementService]
    });
  });

  it('should be created', inject([PatientManagementService], (service: PatientManagementService) => {
    expect(service).toBeTruthy();
  }));
});
