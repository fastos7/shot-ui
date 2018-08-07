import { TestBed, inject } from '@angular/core/testing';

import { ViewOrderService } from './view-order.service';

describe('ViewOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewOrderService]
    });
  });

  it('should be created', inject([ViewOrderService], (service: ViewOrderService) => {
    expect(service).toBeTruthy();
  }));
});
