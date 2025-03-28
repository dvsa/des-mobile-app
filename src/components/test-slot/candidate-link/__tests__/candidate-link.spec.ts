import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { AppModule } from '@app/app.module';
import { Style } from '@capacitor/status-bar';
import { ComponentsModule } from '@components/common/common-components.module';
import { CandidateLinkComponent } from '@components/test-slot/candidate-link/candidate-link';
import { StoreModule } from '@ngrx/store';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';

describe('CandidateLinkComponent', () => {
  let fixture: ComponentFixture<CandidateLinkComponent>;
  let component: CandidateLinkComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateLinkComponent],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        CommonModule,
        CandidateDetailsPageModule,
        StoreModule.forRoot({}),
      ],
    });

    fixture = TestBed.createComponent(CandidateLinkComponent);
    component = fixture.componentInstance;
    component.slot = {
      slotDetail: {},
      vehicleTypeCode: '',
      vehicleSlotTypeCode: 0,
      testCentre: {},
      booking: {},
      examinerVisiting: false,
    };
  });

  describe('openCandidateDetailsModal', () => {
    it('should configure status bar to dark style', async () => {
      spyOn(component.accessibilityService, 'configureStatusBar').and.callThrough();
      await component.openCandidateDetailsModal();
      expect(component.accessibilityService.configureStatusBar).toHaveBeenCalledWith(Style.Dark);
    });

    it('should not create a new modal if one is already present', async () => {
      spyOn(component.modalController, 'getTop').and.resolveTo({
        present: async () => {},
      } as HTMLIonModalElement);
      spyOn(component.modalController, 'create');
      await component.openCandidateDetailsModal();
      expect(component.modalController.create).not.toHaveBeenCalled();
    });

    it('should create and present a new modal if none is present', async () => {
      spyOn(component.modalController, 'getTop').and.returnValue(Promise.resolve(null));
      spyOn(component.modalController, 'create').and.resolveTo({
        present: async () => {},
      } as HTMLIonModalElement);
      await component.openCandidateDetailsModal();
      expect(component.modalController.create).toHaveBeenCalled();
    });

    it('should pass correct component props to the modal', async () => {
      spyOn(component.modalController, 'getTop').and.resolveTo(null);
      spyOn(component.modalController, 'create').and.callFake(async (options) => {
        expect(options.componentProps).toEqual({
          isPracticeMode: component.isPracticeMode,
          slots: component.slots,
          slot: component.slot,
          slotChanged: component.slotChanged,
          isTeamJournal: component.isTeamJournal,
        });
        return {
          present: async () => {},
        } as HTMLIonModalElement;
      });
      await component.openCandidateDetailsModal();
    });

    it('should apply the correct zoom class to the modal', async () => {
      spyOn(component.modalController, 'getTop').and.resolveTo(null);
      spyOn(component.accessibilityService, 'getTextZoomClass').and.returnValue('zoom-class');
      spyOn(component.modalController, 'create').and.callFake(async (options) => {
        expect(options.cssClass).toContain('modal-fullscreen zoom-class');
        return {
          present: async () => {},
        } as HTMLIonModalElement;
      });
      await component.openCandidateDetailsModal();
    });
  });
});
