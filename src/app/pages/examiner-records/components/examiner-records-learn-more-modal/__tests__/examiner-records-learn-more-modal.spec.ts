import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ExaminerRecordsLearnMoreModal } from '@pages/examiner-records/components/examiner-records-learn-more-modal/examiner-records-learn-more-modal';

describe('ExaminerRecordsLearnMoreModalComponent', () => {
  let component: ExaminerRecordsLearnMoreModal;
  let fixture: ComponentFixture<ExaminerRecordsLearnMoreModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerRecordsLearnMoreModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExaminerRecordsLearnMoreModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onOk', () => {
    it('should dismiss modal', () => {
      const dismissSpy = spyOn(component.modalCtrl, 'dismiss');
      component.onOk();
      expect(dismissSpy).toHaveBeenCalled();
    });
  });
});
