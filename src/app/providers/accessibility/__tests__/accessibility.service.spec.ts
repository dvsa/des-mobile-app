import { TestBed, waitForAsync } from '@angular/core/testing';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

describe('AccessibilityService', () => {
  let accessibilityService: AccessibilityService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessibilityService,
      ],
    });

    accessibilityService = TestBed.inject(AccessibilityService);
  }));

  describe('getTextZoom', () => {
    it('should return regular when not zoom', () => {
      expect(accessibilityService.getTextZoom(null))
        .toEqual('regular');
    });
    it('should return regular when zoom is less than 100', () => {
      expect(accessibilityService.getTextZoom(99))
        .toEqual('regular');
    });
    it('should return x-large when zoom is 131 or above', () => {
      expect(accessibilityService.getTextZoom(132))
        .toEqual('x-large');
    });
    it('should return large when zoom is 106 or above', () => {
      expect(accessibilityService.getTextZoom(107))
        .toEqual('large');
    });
  });

  describe('getTextZoomClass', () => {
    it('should concatenate the value from getTextZoom to a text-zoom string', () => {
      spyOn(accessibilityService, 'getTextZoom')
        .and
        .returnValue('regular');
      expect(accessibilityService.getTextZoomClass())
        .toEqual('text-zoom-regular');
    });
  });

  describe('configureAccessibility', () => {
    it('should call updateTextZoom and call getTextZoomCallback with the value of getTextZoom', async () => {
      spyOn(accessibilityService, 'getTextZoomCallback');
      await accessibilityService.configureAccessibility();

      expect(accessibilityService.getTextZoomCallback)
        .toHaveBeenCalledWith(150);
    });
  });
  describe('afterAppResume', () => {
    it('should call usePreferredTextZoom with true and'
      + ' call getTextZoomCallback with the value of getTextZoom', async () => {
      spyOn(accessibilityService, 'getTextZoomCallback');

      await accessibilityService.afterAppResume();

      expect(accessibilityService.getTextZoomCallback)
        .toHaveBeenCalledWith(150);
    });
  });

  describe('getTextZoomCallback', () => {
    it('should set textZoom to the passed parameter', () => {
      accessibilityService.getTextZoomCallback(1);
      expect(accessibilityService.textZoom)
        .toEqual(1);
    });
  });

});
