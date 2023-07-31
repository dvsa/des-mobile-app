import { TestBed } from '@angular/core/testing';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { GetCurrentOrientationResult } from '@capawesome/capacitor-screen-orientation/dist/esm/definitions';
import { ApplicationRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApplicationRefMock } from '@mocks/angular-mocks/application-ref.mock';

describe('OrientationMonitorProvider', () => {
  let provider: OrientationMonitorProvider;
  const mockCurrentOrientation = {
    type: 'portrait',
  } as GetCurrentOrientationResult;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrientationMonitorProvider,
        {
          provide: ApplicationRef,
          useClass: ApplicationRefMock,
        },
      ],
    });

    provider = TestBed.inject(OrientationMonitorProvider);
    spyOn(ScreenOrientation, 'removeAllListeners');
    spyOn(ScreenOrientation, 'addListener');
    spyOn(ScreenOrientation, 'getCurrentOrientation')
      .and
      .returnValue(Promise.resolve(mockCurrentOrientation));
  });

  afterAll(() => {
    ScreenOrientation.removeAllListeners();
  });

  describe('tearDownListener', () => {
    it('should call removeAllListeners', () => {
      provider.tearDownListener();
      expect(ScreenOrientation.removeAllListeners)
        .toHaveBeenCalled();
    });
  });

  describe('monitorOrientation', () => {
    it('should set iisPortraitMode$ to true if the device is in portrait mode', async () => {
      await provider.monitorOrientation();

      expect(ScreenOrientation.getCurrentOrientation)
        .toHaveBeenCalled();
      provider.isPortraitMode$
        .pipe(take(1))
        .subscribe((value) => {
          expect(value)
            .toEqual(true);
        });
      expect(ScreenOrientation.addListener)
        .toHaveBeenCalled();
    });
  });
});
