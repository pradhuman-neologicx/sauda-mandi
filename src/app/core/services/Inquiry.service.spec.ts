import { TestBed } from '@angular/core/testing';
import { InquiryService } from './Inquiry.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('InquiryService', () => {
  let service: InquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(InquiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
