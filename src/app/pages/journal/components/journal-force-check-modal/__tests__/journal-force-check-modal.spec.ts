import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { CandidateDetailsPage } from '@pages/candidate-details/candidate-details.page';
import { CANDIDATE_DETAILS_PAGE } from '@pages/page-names.constants';
import { OverlayEventDetail } from '@ionic/core';
import { JournalForceCheckModal } from '../journal-force-check-modal';

describe('JournalForceCheckModal', () => {
  let fixture: ComponentFixture<JournalForceCheckModal>;
  let component: JournalForceCheckModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalForceCheckModal,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
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
