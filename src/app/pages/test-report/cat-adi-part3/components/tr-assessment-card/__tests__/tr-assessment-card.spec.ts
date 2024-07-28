import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestReportAssessmentAnswer } from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';
import { TestReportAssessmentCard } from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MockComponent } from 'ng-mocks';

describe('TestReportAssessmentCard', () => {
  let fixture: ComponentFixture<TestReportAssessmentCard>;
  let component: TestReportAssessmentCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportAssessmentCard, MockComponent(TestReportAssessmentAnswer)],
      imports: [PipesModule, CommonModule, IonicModule],
    });

    fixture = TestBed.createComponent(TestReportAssessmentCard);
    component = fixture.componentInstance;
  }));

  describe('trAssessmentAnswerChange', () => {
    it('should emit trAssessmentAnswerChange with answer as a number', () => {
      spyOn(component.answerChange, 'emit');
      component.trAssessmentAnswerChange(1, '2');
      expect(component.answerChange.emit).toHaveBeenCalledWith({ question: 1, answer: 2 });
    });
    it('should emit trAssessmentAnswerChange with answer as null', () => {
      spyOn(component.answerChange, 'emit');
      component.trAssessmentAnswerChange(1, null);
      expect(component.answerChange.emit).toHaveBeenCalledWith({ question: 1, answer: null });
    });
  });
});
