import { TestBed, waitForAsync } from '@angular/core/testing';
import { ColourContrastService } from '@providers/colour-contrast/colour-contrast.service';

describe('ColourContrastService', () => {
  let colourContrastService: ColourContrastService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ColourContrastService,
      ],
    });

    colourContrastService = TestBed.inject(ColourContrastService);
  }));

  describe('luminance', () => {
    it('should return properly calculated variables', () => {
      spyOn(colourContrastService, 'relativeLuminance').and.returnValue(1);
      expect(colourContrastService.luminance([1, 2, 3])).toEqual(1);
    });
  });
  describe('hexToRgb', () => {
    it('should return 3 values between 0 and 255 equal to the hexadecimal values within the string sent', () => {
      expect(colourContrastService.hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
    });
  });
  describe('getContrastRatio', () => {
    it('should convert the hex codes to rgb if strings are passed in', () => {
      spyOn(colourContrastService, 'hexToRgb').and.callThrough();
      colourContrastService.getContrastRatio('#FFFFFF', '#000000');
      expect(colourContrastService.hexToRgb).toHaveBeenCalledWith('#FFFFFF');
      expect(colourContrastService.hexToRgb).toHaveBeenCalledWith('#000000');
    });
    it('should return l1 + 0.05 / l2 + 0.05 if l1 is bigger than l2', () => {
      expect(colourContrastService.getContrastRatio([255, 255, 255], [1, 1, 1])).toEqual(20.87);
    });
    it('should return l2 + 0.05 / l1 + 0.05 if l1 not bigger than l2', () => {
      expect(colourContrastService.getContrastRatio([1, 1, 1])).toEqual(20.87);
    });
  });
  describe('relativeLuminance', () => {
    it('should return Math.pow((input/255 + 0.055) / 1.055, 2.4) ' +
      'if input/255 is more than 0.04045', () => {
      expect(colourContrastService.relativeLuminance(255)).toEqual(1);
    });
    it('should return Math.pow((input/255)/12.92) ' +
      'if input/255 is less than or equal to 0.04045', () => {
      expect(colourContrastService.relativeLuminance(1)).toEqual(0.0003035269835488375);
    });
  });

});
