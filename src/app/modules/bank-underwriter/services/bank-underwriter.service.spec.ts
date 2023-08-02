import { TestBed } from '@angular/core/testing';

import { BankUnderwriterService } from './bank-underwriter.service';

describe('BankUnderwriterService', () => {
  let service: BankUnderwriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankUnderwriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
