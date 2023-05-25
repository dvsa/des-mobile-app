import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
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

describe('FinishTestModal', () => {
  let modalFixture: ComponentFixture<FinishTestModal>;
  let modalComponent: FinishTestModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinishTestModal,
      ],
      imports: [
        StoreModule.forRoot({}),
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
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

    modalFixture = TestBed.createComponent(FinishTestModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
    modalComponent.completeTest = jasmine.createSpy('completeTest');
    modalComponent.destroyTestSubs = jasmine.createSpy('destroyTestSubs');
  }));

  describe('onCompleteTest', () => {
    it('expect completeTest to be called', async () => {
      await modalComponent.onCompleteTest();
      expect(modalComponent.destroyTestSubs).toHaveBeenCalled();
      expect(modalComponent.completeTest).toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('expect modalController dismiss', async () => {
      await modalComponent.onBack();
      expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
    });
  });
});
