import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamButton } from '../exit-sam-button';

describe('ExitSamButton', () => {
  let fixture: ComponentFixture<ExitSamButton>;
  let component: ExitSamButton;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, AppModule, ExitSamButton],
      providers: [{ provide: DeviceProvider, useClass: DeviceProviderMock }],
    });

    fixture = TestBed.createComponent(ExitSamButton);
    component = fixture.componentInstance;
  });

  describe('onTouchEnd', () => {
    it('should clear the hold timeout on touch end', () => {
      spyOn(window, 'clearTimeout');
      component.onTouchStart();
      component.onTouchEnd();
      expect(clearTimeout).toHaveBeenCalledWith(component.holdTimeout);
    });

    it('should not throw an error if onTouchEnd is called without onTouchStart', () => {
      spyOn(window, 'clearTimeout');
      expect(() => component.onTouchEnd()).not.toThrow();
      expect(clearTimeout).toHaveBeenCalledWith(undefined);
    });
  });

  describe('escapeSAM', () => {
    it('should emit escapeSamBannerClicked with false', () => {
      spyOn(component.escapeSamButtonClicked, 'emit');
      component.escapeSAM();
      expect(component.escapeSamButtonClicked.emit).toHaveBeenCalledWith(false);
    });

    it('should emit samEscaped', () => {
      spyOn(component.samEscaped, 'emit');
      component.escapeSAM();
      expect(component.samEscaped.emit).toHaveBeenCalled();
    });
  });

  describe('onTouchStart', () => {
    it('should set a timeout to call escapeSAM if button is active', fakeAsync(() => {
      spyOn(component, 'escapeSAM');
      component.isButtonActive = true;
      component.onTouchStart();
      tick(component.timeToHold);
      expect(component.escapeSAM).toHaveBeenCalled();
    }));

    it('should not set a timeout if button is not active', fakeAsync(() => {
      spyOn(component, 'escapeSAM');
      component.isButtonActive = false;
      component.onTouchStart();
      tick(component.timeToHold);
      expect(component.escapeSAM).not.toHaveBeenCalled();
    }));
  });
});
