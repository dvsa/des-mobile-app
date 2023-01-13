import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import {
  TestReportAssessmentCard,
} from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { CommonModule } from '@angular/common';

describe('TestReportAssessmentCard', () => {
  let fixture: ComponentFixture<TestReportAssessmentCard>;
  let component: TestReportAssessmentCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PipesModule,
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
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
