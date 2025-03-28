import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionFiveCardComponent } from '@pages/test-report/cat-cpc/components/question-five-card/question-five-card';

describe('QuestionFiveCardComponent', () => {
  let fixture: ComponentFixture<QuestionFiveCardComponent>;
  let component: QuestionFiveCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [QuestionFiveCardComponent],
    });

    fixture = TestBed.createComponent(QuestionFiveCardComponent);
    component = fixture.componentInstance;
  });

  describe('answerChanged', () => {
    it('emits answerPayload with correct parameters when answer is selected', () => {
      component.answerPayload = new EventEmitter();
      spyOn(component.answerPayload, 'emit');
      component.answerChanged({
        answer: {
          selected: true,
          label: 'selected label',
        },
        answerNumber: '1',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 5,
        answer: {
          selected: true,
          label: 'selected label',
        },
        answerNumber: '1',
      });
    });

    it('emits answerPayload with correct parameters when answer is not selected', () => {
      spyOn(component.answerPayload, 'emit');
      component.answerChanged({
        answer: {
          selected: false,
          label: 'not selected label',
        },
        answerNumber: '2',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 5,
        answer: {
          selected: false,
          label: 'not selected label',
        },
        answerNumber: '2',
      });
    });

    it('emits answerPayload with correct parameters when answerNumber is empty', () => {
      spyOn(component.answerPayload, 'emit');
      component.answerChanged({
        answer: {
          selected: true,
          label: 'empty answer number',
        },
        answerNumber: '',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 5,
        answer: {
          selected: true,
          label: 'empty answer number',
        },
        answerNumber: '',
      });
    });

    it('emits answerPayload with correct parameters when answer label is empty', () => {
      spyOn(component.answerPayload, 'emit');
      component.answerChanged({
        answer: {
          selected: true,
          label: '',
        },
        answerNumber: '3',
      });
      expect(component.answerPayload.emit).toHaveBeenCalledWith({
        questionNumber: 5,
        answer: {
          selected: true,
          label: '',
        },
        answerNumber: '3',
      });
    });
  });
});
