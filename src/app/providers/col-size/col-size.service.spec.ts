import { TestBed } from '@angular/core/testing';

import { ColSizeService } from './col-size.service';

describe('ColSizeService', () => {
  let service: ColSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
