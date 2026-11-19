import { TestBed } from '@angular/core/testing';
import { ClasseRoutinesService } from './classe-routines.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClasseRoutinesService', () => {
  let service: ClasseRoutinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ClasseRoutinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
