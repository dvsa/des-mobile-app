import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExaminerRecordsLabelTextComponent } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text';

describe('ExaminerRecordsLearnMoreModalComponent', () => {
  let component: ExaminerRecordsLabelTextComponent;
  let fixture: ComponentFixture<ExaminerRecordsLabelTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerRecordsLabelTextComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExaminerRecordsLabelTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onShowLearnMoreModal', () => {
    it('should emit showLearnMoreModal event', () => {
      spyOn(component.showLearnMoreModal, 'emit');
      component.onShowLearnMoreModal();
      expect(component.showLearnMoreModal.emit).toHaveBeenCalled();
    });
  });
});
