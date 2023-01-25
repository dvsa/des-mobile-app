import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionFiveCardComponent } from '@pages/test-report/cat-cpc/components/question-five-card/question-five-card';

describe('QuestionFiveCardComponent', () => {
  let fixture: ComponentFixture<QuestionFiveCardComponent>;
  let component: QuestionFiveCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionFiveCardComponent,
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
