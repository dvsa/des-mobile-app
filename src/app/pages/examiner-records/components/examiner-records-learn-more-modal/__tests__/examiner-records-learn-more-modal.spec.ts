import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExaminerRecordsLearnMoreModal } from '@pages/examiner-records/components/examiner-records-learn-more-modal/examiner-records-learn-more-modal';

describe('ExaminerRecordsLearnMoreModalComponent', () => {
  let component: ExaminerRecordsLearnMoreModal;
  let fixture: ComponentFixture<ExaminerRecordsLearnMoreModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerRecordsLearnMoreModal],
      imports: [IonicModule.forRoot()],
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
