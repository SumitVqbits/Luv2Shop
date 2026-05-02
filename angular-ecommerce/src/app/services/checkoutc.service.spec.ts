import { TestBed } from '@angular/core/testing';

import { CheckoutcService } from './checkoutc.service';

describe('CheckoutcService', () => {
  let service: CheckoutcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
