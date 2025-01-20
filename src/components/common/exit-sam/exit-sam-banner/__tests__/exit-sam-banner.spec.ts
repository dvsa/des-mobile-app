import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamBanner } from '../exit-sam-banner';

describe('ExitSamBanner', () => {
  let fixture: ComponentFixture<ExitSamBanner>;
  let component: ExitSamBanner;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamBanner],
      imports: [IonicModule, AppModule],
      providers: [{ provide: DeviceProvider, useClass: DeviceProviderMock }],
    });

    fixture = TestBed.createComponent(ExitSamBanner);
    component = fixture.componentInstance;
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
        spyOn(component, 'escapeSAM');
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.escapeSAM).toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if not pressed', fakeAsync(() => {
        spyOn(component, 'escapeSAM');
        component.onTouchStart();
        component.onTouchEnd();
        tick(component.timeToHold);
        expect(component.escapeSAM).not.toHaveBeenCalled();
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

    describe('escapeSAM', () => {
      it('should emit the escape sam event', async () => {
        spyOn(component.escapeSamBannerClicked, 'emit');
        await component.escapeSAM();
        expect(component.escapeSamBannerClicked.emit).toHaveBeenCalled();
      });
    });
  });
});
