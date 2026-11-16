import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { GetCurrentOrientationResult } from '@capawesome/capacitor-screen-orientation/dist/esm/definitions';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

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
        },
      ],
    });

    provider = TestBed.inject(OrientationMonitorProvider);
    vi.spyOn(ScreenOrientation, 'removeAllListeners').mockReturnValue(undefined);
    vi.spyOn(ScreenOrientation, 'addListener').mockReturnValue(undefined);
    vi.spyOn(ScreenOrientation, 'getCurrentOrientation').mockReturnValue(Promise.resolve(mockCurrentOrientation));
  });

  afterAll(() => {
    void ScreenOrientation.removeAllListeners();
  });

  describe('tearDownListener', () => {
    it('should call removeAllListeners', async () => {
      await provider.tearDownListener();

      expect(ScreenOrientation.removeAllListeners).toHaveBeenCalled();
    });
  });

  describe('monitorOrientation', () => {
    it('should set isPortraitMode$ to true if the device is in portrait mode', async () => {
      vi.spyOn(provider.isPortraitMode$, 'next').mockReturnValue(undefined);

      await provider.monitorOrientation();

      expect(ScreenOrientation.getCurrentOrientation).toHaveBeenCalled();
      expect(provider.isPortraitMode$.next).toHaveBeenCalledWith(true);
      expect(ScreenOrientation.addListener).toHaveBeenCalled();
    });
  });
});
