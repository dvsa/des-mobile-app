import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';

import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { Store } from '@ngrx/store';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { SecureStorageMock } from '@mocks/ionic-mocks/secure-storage.mock';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { PreviewModeModal } from '../preview-mode-modal';

class MockStore { }

describe('PreviewModeModal', () => {
  let fixture: ComponentFixture<PreviewModeModal>;
  let component: PreviewModeModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewModeModal,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: AppInfoProvider, useClass: AppInfoProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

    fixture = TestBed.createComponent(PreviewModeModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Class', () => {
    describe('onCancel', () => {
      it('should dismiss modal with `cancel` callback', async () => {
        await component.onCancel();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
    describe('onContinue', () => {
      it('should dismiss modal with `start` callback', async () => {
        await component.onContinue();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
      });
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('#preview-mode-return-to-journal-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
    it('should call onContinue when the Continue button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onContinue');
      const button = fixture.debugElement.query(By.css('#preview-mode-continue-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onContinue).toHaveBeenCalled();
    });
  });
});
