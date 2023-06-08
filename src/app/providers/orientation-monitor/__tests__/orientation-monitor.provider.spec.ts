import { TestBed } from '@angular/core/testing';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { GetCurrentOrientationResult } from '@capawesome/capacitor-screen-orientation/dist/esm/definitions';
import { of } from 'rxjs';

describe('OrientationMonitorProvider', () => {
  let provider: OrientationMonitorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrientationMonitorProvider,
      ],
    });

    provider = TestBed.inject(OrientationMonitorProvider);
  });

  describe('tearDownListener', () => {
    it('should call removeAllListeners', () => {
      spyOn(ScreenOrientation, 'removeAllListeners');
      provider.tearDownListener();
      expect(ScreenOrientation.removeAllListeners());
    });
  });

  describe('monitorOrientation', () => {
    it('should set iisPortraitMode$ to true if the device is in portrait mode', async () => {
      spyOn(ScreenOrientation, 'getCurrentOrientation').and.returnValue(of({
        type: 'portrait',
      } as GetCurrentOrientationResult).toPromise());
      await provider.monitorOrientation();
      provider.isPortraitMode$.subscribe((value) => {
        expect(value).toEqual(true);
      });
    });
  });
});
