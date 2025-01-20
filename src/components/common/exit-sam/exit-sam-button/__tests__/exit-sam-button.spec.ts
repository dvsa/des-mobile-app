import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { ExitSamButton } from '../exit-sam-button';

describe('ExitSamButton', () => {
  let fixture: ComponentFixture<ExitSamButton>;
  let component: ExitSamButton;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamButton],
      imports: [IonicModule, AppModule],
      providers: [{ provide: DeviceProvider, useClass: DeviceProviderMock }],
    });

    fixture = TestBed.createComponent(ExitSamButton);
    component = fixture.componentInstance;
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
        spyOn(component, 'escapeSAM');
        component.isButtonActive = true;
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.escapeSAM).toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if button is not active', fakeAsync(() => {
        spyOn(component, 'escapeSAM');
        component.isButtonActive = false;
        component.onTouchStart();
        tick(component.timeToHold);
        expect(component.escapeSAM).not.toHaveBeenCalled();
      }));

      it('should not call disableSAMAndExit if not pressed', fakeAsync(() => {
        spyOn(component, 'escapeSAM');
        component.isButtonActive = true;
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

    describe('escapeSAM', () => {
      it('should emit the escape sam event', () => {
        spyOn(component.escapeSamButtonClicked, 'emit');
        component.escapeSAM();
        expect(component.escapeSamButtonClicked.emit).toHaveBeenCalled();
      });
    });
  });
});
