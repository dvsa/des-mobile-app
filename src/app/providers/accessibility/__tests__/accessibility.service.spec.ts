import { TestBed } from '@angular/core/testing';

import { AccessibilityService } from '../accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTextZoom', () => {
    it('should return regular when not zoom', () => {
      expect(service.getTextZoom(null)).toEqual('regular');
    });
    it('should return regular when zoom is less than 106', () => {
      expect(service.getTextZoom(100)).toEqual('regular');
    });
    it('should return x-large when zoom is 131 or above', () => {
      expect(service.getTextZoom(132)).toEqual('x-large');
    });
    it('should return large when zoom is 106 or above', () => {
      expect(service.getTextZoom(107)).toEqual('large');
    });
  });

  describe('getTextZoomClass', () => {
    it('should concatenate the value from getTextZoom to a text-zoom string', () => {
      spyOn(service, 'getTextZoom').and.returnValue('regular');
      expect(service.getTextZoomClass()).toEqual('text-zoom-regular');
    });
  });
});
