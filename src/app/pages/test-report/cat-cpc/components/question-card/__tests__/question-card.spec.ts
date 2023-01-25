import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionCardComponent } from '@pages/test-report/cat-cpc/components/question-card/question-card';

describe('QuestionCardComponent', () => {
  let fixture: ComponentFixture<QuestionCardComponent>;
  let component: QuestionCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionCardComponent,
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
