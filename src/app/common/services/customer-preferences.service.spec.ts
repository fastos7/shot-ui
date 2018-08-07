import { TestBed, inject } from '@angular/core/testing';

import { CustomerPreferencesService } from './customer-preferences.service';

describe('CustomerPreferencesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerPreferencesService]
    });
  });

  it('should be created', inject([CustomerPreferencesService], (service: CustomerPreferencesService) => {
    expect(service).toBeTruthy();
  }));
});
