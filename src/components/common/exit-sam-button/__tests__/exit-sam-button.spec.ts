import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamButton } from '../exit-sam-button';

describe('ExitSamButton', () => {
  let fixture: ComponentFixture<ExitSamButton>;
  let component: ExitSamButton;
  let modalController: ModalController;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamButton],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ExitSamButton);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    deviceProvider = TestBed.inject(DeviceProvider);

    spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
  }));

  describe('Class', () => {
    describe('onTouchStart', () => {
      it('should set isPressed to true', () => {
        component.onTouchStart();
        expect(component.isPressed).toBeTrue();
      });

      it('should call disableSAMAndExit after timeToHold if still pressed and button is active', fakeAsync(() => {
        spyOn(component, 'disableSAMAndExit');
        component.isButtonActive = true;
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.disableSAMAndExit).toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if button is not active', fakeAsync(() => {
        spyOn(component, 'disableSAMAndExit');
        component.isButtonActive = false;
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.disableSAMAndExit).not.toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if not pressed', fakeAsync(() => {
        spyOn(component, 'disableSAMAndExit');
        component.isButtonActive = true;
        component.onTouchStart();
        component.onTouchEnd();
        tick(component.timeToHold);
        expect(component.disableSAMAndExit).not.toHaveBeenCalled();
      }));
    });

    describe('onTouchEnd', () => {
      it('should set isPressed to false', () => {
        component.onTouchEnd();
        expect(component.isPressed).toBeFalse();
      });

      it('should clear the timeout', () => {
        spyOn(window, 'clearTimeout');
        component.onTouchEnd();
        expect(clearTimeout).toHaveBeenCalledWith(component.timeout);
      });
    });

    describe('onClick', () => {
      it('should toggle isButtonActive', () => {
        const initialStatus = component.isButtonActive;
        component.onClick();
        expect(component.isButtonActive).toBe(!initialStatus);
      });

      it('should emit escapeSamButtonClicked with the new status', () => {
        spyOn(component.escapeSamButtonClicked, 'emit');
        component.onClick();
        expect(component.escapeSamButtonClicked.emit).toHaveBeenCalledWith(component.isButtonActive);
      });
    });

    describe('disableSAMAndExit', () => {
      it('should disable single app mode', async () => {
        await component.disableSAMAndExit();
        expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      });

      it('should open settings URL', async () => {
        spyOn(AppLauncher, 'openUrl').and.returnValue(Promise.resolve({ completed: true } as OpenURLResult));
        await component.disableSAMAndExit();
        expect(AppLauncher.openUrl).toHaveBeenCalledWith({ url: 'App-prefs://' });
      });

      it('should log error if openUrl fails', async () => {
        const error = new Error('Failed to open URL');
        spyOn(AppLauncher, 'openUrl').and.returnValue(Promise.reject(error));
        spyOn(console, 'log');
        await component.disableSAMAndExit();
        expect(console.log).toHaveBeenCalledWith(error);
      });
    });
  });
});
