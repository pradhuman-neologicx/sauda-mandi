import { TestBed } from '@angular/core/testing';
import { NotificationNewService } from './notificationnew.service';

describe('NotificationNewService', () => {
  let service: NotificationNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
