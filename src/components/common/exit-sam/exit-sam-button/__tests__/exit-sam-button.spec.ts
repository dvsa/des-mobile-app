import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamButton } from '../exit-sam-button';

describe('ExitSamButton', () => {
  let fixture: ComponentFixture<ExitSamButton>;
  let component: ExitSamButton;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExitSamButton],
      providers: [
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(ExitSamButton);
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

  describe('escapeSAM', () => {
    it('should emit escapeSamBannerClicked with false', () => {
      vi.spyOn(component.escapeSamButtonClicked, 'emit').mockReturnValue(undefined);
      component.escapeSAM();
      expect(component.escapeSamButtonClicked.emit).toHaveBeenCalledWith(false);
    });

    it('should emit samEscaped', () => {
      vi.spyOn(component.samEscaped, 'emit').mockReturnValue(undefined);
      component.escapeSAM();
      expect(component.samEscaped.emit).toHaveBeenCalled();
    });
  });

  describe('onTouchStart', () => {
    it('should set a timeout to call escapeSAM if button is active', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(component, 'escapeSAM').mockReturnValue(undefined);
        component.isButtonActive = true;
        component.onTouchStart();
        await vi.advanceTimersByTimeAsync(component.timeToHold);
        expect(component.escapeSAM).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not set a timeout if button is not active', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(component, 'escapeSAM').mockReturnValue(undefined);
        component.isButtonActive = false;
        component.onTouchStart();
        await vi.advanceTimersByTimeAsync(component.timeToHold);
        expect(component.escapeSAM).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
