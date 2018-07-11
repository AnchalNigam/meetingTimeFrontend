import { TestBed, inject } from '@angular/core/testing';

import { MeetingRouteGuardService } from './meeting-route-guard.service';

describe('MeetingRouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetingRouteGuardService]
    });
  });

  it('should be created', inject([MeetingRouteGuardService], (service: MeetingRouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
