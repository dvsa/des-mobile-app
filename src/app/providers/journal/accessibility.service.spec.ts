import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@shared/pipes/pipes.module';

import { AccessibilityService } from '@providers/accessibility/accessibility.service';

describe('AccessibilityService', () => {
  jasmine.getEnv().allowRespy(true);
  let accessibilityService: AccessibilityService;
  let store$: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        PipesModule,
      ],
      providers: [
        AccessibilityService,
      ],
    });

    accessibilityService = TestBed.inject(AccessibilityService);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('getTextZoom', () => {
    it('should return regular when not zoom', () => {
      expect(accessibilityService.getTextZoom(null)).toEqual('regular');
    });
    it('should return regular when zoom is less than 106', () => {
      expect(accessibilityService.getTextZoom(100)).toEqual('regular');
    });
    it('should return x-large when zoom is 131 or above', () => {
      expect(accessibilityService.getTextZoom(132)).toEqual('x-large');
    });
    it('should return large when zoom is 106 or above', () => {
      expect(accessibilityService.getTextZoom(107)).toEqual('large');
    });
  });

  describe('getTextZoomClass', () => {
    it('should concatenate the value from getTextZoom to a text-zoom string', () => {
      spyOn(accessibilityService, 'getTextZoom').and.returnValue('regular');
      expect(accessibilityService.getTextZoomClass()).toEqual('text-zoom-regular');
    });
  });

});
