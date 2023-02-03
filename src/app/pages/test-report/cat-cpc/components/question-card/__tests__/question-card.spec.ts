import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionCardComponent } from '@pages/test-report/cat-cpc/components/question-card/question-card';
import { MockComponent } from 'ng-mocks';
import { QuestionTitleComponent } from '@pages/test-report/cat-cpc/components/question-title/question-title';
import { QuestionAnswerComponent } from '@pages/test-report/cat-cpc/components/question-answer/question-answer';
import { QuestionScoreComponent } from '@pages/test-report/cat-cpc/components/question-score/question-score';
import { QuestionSubtitleComponent } from '@pages/test-report/cat-cpc/components/question-subtitle/question-subtitle';
import { AdditionalItemsComponent } from '@pages/test-report/cat-cpc/components/additional-items/additional-items';

describe('QuestionCardComponent', () => {
  let fixture: ComponentFixture<QuestionCardComponent>;
  let component: QuestionCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionCardComponent,
        MockComponent(QuestionTitleComponent),
        MockComponent(QuestionSubtitleComponent),
        MockComponent(QuestionAnswerComponent),
        MockComponent(QuestionScoreComponent),
        MockComponent(AdditionalItemsComponent),
      ],
    });

    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
  }));

  describe('answerChanged', () => {
    it('should emit answerPayload with the correct values', () => {
      spyOn(component.answerPayload, 'emit');
      component.questionNumber = 1;
      component.answerChanged({
        answer: {
          selected: true,
          label: 'label',
        },
        answerNumber: '1',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 1,
        answer: {
          selected: true,
          label: 'label',
        },
        answerNumber: '1',
      });
    });
  });
});
