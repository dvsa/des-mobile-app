import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamBanner } from '../exit-sam-banner';

describe('ExitSamBanner', () => {
  let fixture: ComponentFixture<ExitSamBanner>;
  let component: ExitSamBanner;
  let modalController: ModalController;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamBanner],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ExitSamBanner);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    deviceProvider = TestBed.inject(DeviceProvider);

    spyOn(AppLauncher, 'openUrl').and.returnValue(Promise.resolve({ completed: true } as OpenURLResult));
    spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
  }));

  describe('Class', () => {
    describe('onTouchStart', () => {
      it('should set isPressed to true', () => {
        component.onTouchStart();
        expect(component.isPressed).toBeTrue();
      });

      it('should call disableSAMAndExit after timeToHold if still pressed', fakeAsync(() => {
        spyOn(component, 'disableSAMAndExit');
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.disableSAMAndExit).toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if not pressed', fakeAsync(() => {
        spyOn(component, 'disableSAMAndExit');
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
    });

    describe('cancelButtonClicked', () => {
      it('should emit cancelClicked event', () => {
        spyOn(component.cancelClicked, 'emit');
        component.cancelButtonClicked();
        expect(component.cancelClicked.emit).toHaveBeenCalled();
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
