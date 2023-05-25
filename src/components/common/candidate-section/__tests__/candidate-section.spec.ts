import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { CommonModule } from '@angular/common';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { OverlayEventDetail } from '@ionic/core/dist/types/utils/overlays-interface';
import { VehicleRegistrationChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
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

describe('CandidateSectionComponent', () => {
  let fixture: ComponentFixture<CandidateSectionComponent>;
  let component: CandidateSectionComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateSectionComponent],
      imports: [IonicModule, AppModule, ComponentsModule, CommonModule],
      providers: [
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
    fixture = TestBed.createComponent(CandidateSectionComponent);
    component = fixture.componentInstance;
    spyOn(component.store$, 'dispatch');
  }));

  describe('proceed', () => {
    it('should emit continueClickEvent with true', () => {
      spyOn(component.continueClickEvent, 'emit');
      component.proceed();
      expect(component.continueClickEvent.emit)
        .toHaveBeenCalledWith(true);
    });
  });
  describe('openTestResult', () => {
    it('should display modal', async () => {
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {
        },
        onDidDismiss: () => {
          return { data: null } as OverlayEventDetail;
        },
      } as HTMLIonModalElement));
      await component.openVRNModal();
      expect(component.modalController.create).toHaveBeenCalledTimes(1);
    });
    it('should dispatch store with VRNModalOpened', async () => {
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {
        },
        onDidDismiss: () => {
          return { data: null } as OverlayEventDetail;
        },
      } as HTMLIonModalElement));
      await component.openVRNModal();
      expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalOpened());
    });

    it('should dispatch store with VRNModalCancelled if there is no data', async () => {

      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {
        },
        onDidDismiss: () => {
          return { data: null } as OverlayEventDetail;
        },
      } as HTMLIonModalElement));
      await component.openVRNModal();

      spyOn(component.vrnModal, 'onDidDismiss').and.returnValue(Promise.resolve({}));
      await component.openVRNModal();
      expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalCancelled());
    });

    it('should dispatch store with VRNModalSaved and '
            + 'VehicleRegistrationChanged if there is vehicleRegNumber', async () => {

      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {
        },
        onDidDismiss: () => {
          return { data: { vehicleRegNumber: 'test' } } as OverlayEventDetail;
        },
      } as HTMLIonModalElement));
      await component.openVRNModal();

      expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalSaved());
      expect(component.store$.dispatch).toHaveBeenCalledWith(VehicleRegistrationChanged('test'));
    });
  });
});
