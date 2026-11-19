import { TestBed } from '@angular/core/testing';
import { SaudaErpMockService } from './sauda-erp-mock.service';

describe('SaudaErpMockService', () => {
  let service: SaudaErpMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaudaErpMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
