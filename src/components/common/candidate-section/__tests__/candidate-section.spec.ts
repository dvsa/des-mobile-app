import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { provideBasePageMocks } from '@mocks/test-providers';
import { provideMockStore } from '@ngrx/store/testing';

import { OverlayEventDetail } from '@ionic/core';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { VehicleRegistrationChanged } from '@store/tests/vehicle-details/vehicle-details.actions';

describe('CandidateSectionComponent', () => {
  let fixture: ComponentFixture<CandidateSectionComponent>;
  let component: CandidateSectionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CandidateSectionComponent],
      providers: [provideBasePageMocks(), provideMockStore()],
    });
    fixture = TestBed.createComponent(CandidateSectionComponent);
    component = fixture.componentInstance;
    vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('proceed', () => {
    it('should create without an AppComponent provider', () => {
      expect(component).toBeTruthy();
    });

    it('should emit continueClickEvent with true', () => {
      vi.spyOn(component.continueClickEvent, 'emit').mockReturnValue(undefined);
      component.proceed();
      expect(component.continueClickEvent.emit).toHaveBeenCalledWith(true);
    });
  });
  describe('openTestResult', () => {
    it('should display modal', async () => {
      vi.spyOn(component.modalController, 'create').mockReturnValue(
        Promise.resolve({
          present: async () => {},
          onDidDismiss: () => {
            return { data: null } as OverlayEventDetail;
          },
        } as HTMLIonModalElement)
      );
      await component.openVRNModal();
      expect(component.modalController.create).toHaveBeenCalledTimes(1);
    });
    it('should dispatch store with VRNModalOpened', async () => {
      vi.spyOn(component.modalController, 'create').mockReturnValue(
        Promise.resolve({
          present: async () => {},
          onDidDismiss: () => {
            return { data: null } as OverlayEventDetail;
          },
        } as HTMLIonModalElement)
      );
      await component.openVRNModal();
      expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalOpened());
    });

    it('should dispatch store with VRNModalCancelled if there is no data', async () => {
      vi.spyOn(component.modalController, 'create').mockReturnValue(
        Promise.resolve({
          present: async () => {},
          onDidDismiss: () => {
            return { data: null } as OverlayEventDetail;
          },
        } as HTMLIonModalElement)
      );
      await component.openVRNModal();

      vi.spyOn(component.vrnModal, 'onDidDismiss').mockReturnValue(Promise.resolve({}));
      await component.openVRNModal();
      expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalCancelled());
    });

    it(
      'should dispatch store with VRNModalSaved and ' + 'VehicleRegistrationChanged if there is vehicleRegNumber',
      async () => {
        vi.spyOn(component.modalController, 'create').mockReturnValue(
          Promise.resolve({
            present: async () => {},
            onDidDismiss: () => {
              return { data: { vehicleRegNumber: 'test' } } as OverlayEventDetail;
            },
          } as HTMLIonModalElement)
        );
        await component.openVRNModal();

        expect(component.store$.dispatch).toHaveBeenCalledWith(VRNModalSaved());
        expect(component.store$.dispatch).toHaveBeenCalledWith(VehicleRegistrationChanged('test'));
      }
    );
  });
});
