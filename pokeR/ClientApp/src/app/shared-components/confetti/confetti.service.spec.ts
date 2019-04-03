import { TestBed } from '@angular/core/testing';

import { ConfettiService } from './confetti.service';

describe('ConfettiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfettiService = TestBed.get(ConfettiService);
    expect(service).toBeTruthy();
  });
});
