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
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { HeaderComponent } from '@components/common/header-component/header.component';

describe('CandidateSectionComponent', () => {
  let fixture: ComponentFixture<CandidateSectionComponent>;
  let component: CandidateSectionComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateSectionComponent,
        MockComponent(HeaderComponent),
        MockComponent(ModalAlertTitleComponent),
      ],
      imports: [IonicModule, AppModule, ComponentsModule, CommonModule],
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
