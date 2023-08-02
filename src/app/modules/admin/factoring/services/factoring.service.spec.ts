import { TestBed } from '@angular/core/testing';

import { FactoringService } from './factoring.service';

describe('FactoringService', () => {
  let service: FactoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
