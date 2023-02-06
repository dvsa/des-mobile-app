import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionFiveCardComponent } from '@pages/test-report/cat-cpc/components/question-five-card/question-five-card';
import { MockComponent } from 'ng-mocks';
import { QuestionAnswerComponent } from '@pages/test-report/cat-cpc/components/question-answer/question-answer';
import { QuestionScoreComponent } from '@pages/test-report/cat-cpc/components/question-score/question-score';
import { QuestionTitleComponent } from '@pages/test-report/cat-cpc/components/question-title/question-title';
import { QuestionSubtitleComponent } from '@pages/test-report/cat-cpc/components/question-subtitle/question-subtitle';

describe('QuestionFiveCardComponent', () => {
  let fixture: ComponentFixture<QuestionFiveCardComponent>;
  let component: QuestionFiveCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionFiveCardComponent,
        MockComponent(QuestionTitleComponent),
        MockComponent(QuestionSubtitleComponent),
        MockComponent(QuestionAnswerComponent),
        MockComponent(QuestionScoreComponent),
      ],
    });

    fixture = TestBed.createComponent(QuestionFiveCardComponent);
    component = fixture.componentInstance;
  }));

  describe('answerChanged', () => {
    it('should emit answerPayload with correct parameters', () => {
      spyOn(component.answerPayload, 'emit');
      component.answerChanged({
        answer: {
          selected: false,
          label: 'test label',
        },
        answerNumber: 'test',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 5,
        answer: {
          selected: false,
          label: 'test label',
        },
        answerNumber: 'test',
      });
    });
  });
});
