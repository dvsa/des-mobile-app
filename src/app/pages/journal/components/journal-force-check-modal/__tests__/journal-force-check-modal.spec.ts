import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { DeviceProvider } from '@providers/device/device';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
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
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { provideMockStore } from '@ngrx/store/testing';
import { CANDIDATE_DETAILS_PAGE } from '@pages/page-names.constants';
import { CandidateDetailsPage } from '@pages/candidate-details/candidate-details.page';
import { OverlayEventDetail } from '@ionic/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { JournalForceCheckModal } from '../journal-force-check-modal';

describe('JournalForceCheckModal', () => {
  let fixture: ComponentFixture<JournalForceCheckModal>;
  let component: JournalForceCheckModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalForceCheckModal,
        MockComponent(HeaderComponent),
        MockComponent(ModalAlertTitleComponent),
      ],
      imports: [
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
        provideMockStore({}),
      ],
    });

    fixture = TestBed.createComponent(JournalForceCheckModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('onCancel', () => {
    it('should dismiss modal with `cancel` callback', async () => {
      spyOn(modalController, 'dismiss');
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });

  describe('openCandidateDetailsModal', () => {
    it('should create a modal with the correct parameters', async () => {
      spyOn(modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {},
        onWillDismiss: () => ({ data: ModalEvent.CANCEL }) as OverlayEventDetail,
      } as HTMLIonModalElement));

      component.slot = { examinerVisiting: true } as TestSlot;
      component.textZoomClass = 'string';
      component.isTeamJournal = true;
      component.slotChanged = false;

      await component.openCandidateDetailsModal();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CandidateDetailsPage,
        id: CANDIDATE_DETAILS_PAGE,
        cssClass: 'modal-fullscreen string',
        componentProps: {
          slot: { examinerVisiting: true },
          slotChanged: false,
          isTeamJournal: true,
        },
      });
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('#return-to-journal-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});
