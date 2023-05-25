import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import {
  JournalEarlyStartModalMock,
} from '@pages/journal/components/journal-early-start-modal/__mocks__/journal-early-start-modal.mock';
import { NavParamsMock } from '@pages/journal/components/journal-early-start-modal/__mocks__/nav-params.mock';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
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
import { HealthDeclarationModal } from '../health-declaration-modal';

describe('healthDeclarationModal', () => {
  let modalFixture: ComponentFixture<HealthDeclarationModal>;
  let modalComponent: HealthDeclarationModal;
  const mockFile: JournalEarlyStartModalMock = new JournalEarlyStartModalMock();
  const navMock: NavParamsMock = new NavParamsMock();

  beforeEach(waitForAsync(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      declarations: [
        HealthDeclarationModal,
      ],
      imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useFactory: () => navMock },
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
        provideMockStore({}),
      ],
    });

    const mockValue = mockFile.mockSlotDetail();
    spyOn(navMock, 'get').and.returnValue(mockValue);
    modalFixture = TestBed.createComponent(HealthDeclarationModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  it('should call onBack when the Cancel button is clicked', async () => {
    spyOn(modalComponent.modalController, 'dismiss');
    const button = modalFixture.debugElement.query(By.css('#cancel-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    await modalComponent.onBack();
    expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call onCompleteTest when the Submit button is clicked', () => {
    modalComponent.onTestDetailsConfirm = async () => {};
    modalFixture.detectChanges();
    spyOn(modalComponent, 'onCompleteTest').and.callThrough();
    const button = modalFixture.debugElement.query(By.css('#continue-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    expect(modalComponent.onCompleteTest).toHaveBeenCalled();
  });
});
