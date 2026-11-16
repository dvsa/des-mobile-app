import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamBanner } from '../exit-sam-banner';

describe('ExitSamBanner', () => {
  let fixture: ComponentFixture<ExitSamBanner>;
  let component: ExitSamBanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExitSamBanner],
      providers: [
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(ExitSamBanner);
    component = fixture.componentInstance;
  });

  describe('onTouchEnd', () => {
    it('should clear the hold timeout on touch end', () => {
      vi.spyOn(window, 'clearTimeout').mockReturnValue(undefined);
      component.onTouchStart();
      component.onTouchEnd();
      expect(clearTimeout).toHaveBeenCalledWith(component.holdTimeout);
    });

    it('should not throw an error if onTouchEnd is called without onTouchStart', () => {
      vi.spyOn(window, 'clearTimeout').mockReturnValue(undefined);
      expect(() => component.onTouchEnd()).not.toThrow();
      expect(clearTimeout).toHaveBeenCalledWith(undefined);
    });
  });

  describe('cancelButtonClicked', () => {
    it('should emit cancelClicked event', () => {
      vi.spyOn(component.cancelClicked, 'emit').mockReturnValue(undefined);
      component.cancelButtonClicked();
      expect(component.cancelClicked.emit).toHaveBeenCalled();
    });
  });

  describe('escapeSAM', () => {
    it('should emit escapeSamBannerClicked with false', () => {
      vi.spyOn(component.escapeSamBannerClicked, 'emit').mockReturnValue(undefined);
      component.escapeSAM();
      expect(component.escapeSamBannerClicked.emit).toHaveBeenCalledWith(false);
    });

    it('should emit samEscaped', () => {
      vi.spyOn(component.samEscaped, 'emit').mockReturnValue(undefined);
      component.escapeSAM();
      expect(component.samEscaped.emit).toHaveBeenCalled();
    });
  });

  describe('onTouchStart', () => {
    it('should start the hold timeout on touch start', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(component.escapeSamBannerClicked, 'emit').mockReturnValue(undefined);
        vi.spyOn(component.samEscaped, 'emit').mockReturnValue(undefined);
        component.onTouchStart();
        await vi.advanceTimersByTimeAsync(component.timeToHold);
        expect(component.escapeSamBannerClicked.emit).toHaveBeenCalledWith(false);
        expect(component.samEscaped.emit).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should clear the hold timeout on touch end', () => {
      vi.spyOn(window, 'clearTimeout').mockReturnValue(undefined);
      component.onTouchStart();
      component.onTouchEnd();
      expect(clearTimeout).toHaveBeenCalledWith(component.holdTimeout);
    });

    it('should not trigger escapeSAM if touch end is called before timeout', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(component.escapeSamBannerClicked, 'emit').mockReturnValue(undefined);
        vi.spyOn(component.samEscaped, 'emit').mockReturnValue(undefined);

        component.onTouchStart();
        await vi.advanceTimersByTimeAsync(component.timeToHold / 2);
        component.onTouchEnd();
        await vi.advanceTimersByTimeAsync(component.timeToHold / 2);
        expect(component.escapeSamBannerClicked.emit).not.toHaveBeenCalled();
        expect(component.samEscaped.emit).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
