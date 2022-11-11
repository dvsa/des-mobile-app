import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { QuestionAnswerComponent } from '../question-answer';
import { mockAnswer, mockAnswerNumber } from '../__mocks__/question-answer.mock';

describe('QuestionAnswerComponent', () => {
  let fixture: ComponentFixture<QuestionAnswerComponent>;
  let component: QuestionAnswerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionAnswerComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(QuestionAnswerComponent);
    component = fixture.componentInstance;
  }));

  describe('getID', () => {
    it('should return a string of answer#, hash being the number passed in', () => {
      expect(component.getID('1')).toEqual('answer1');
      expect(component.getID('2')).toEqual('answer2');
      expect(component.getID('7')).toEqual('answer7');
    });
  });

  describe('getLabel', () => {
    it('should return a string of answer-label-#, hash being the number passed in', () => {
      expect(component.getLabel('1')).toEqual('answer-label-1');
      expect(component.getLabel('2')).toEqual('answer-label-2');
      expect(component.getLabel('7')).toEqual('answer-label-7');
    });
  });

  describe('answerChanged', () => {
    it('should emit an object containing the answer ', () => {
      spyOn(component.answerToggled, 'emit');
      component.answer = mockAnswer;
      component.answerNumber = mockAnswerNumber;
      component.answerChanged();

      expect(component.answerToggled.emit).toHaveBeenCalledWith({
        answer: mockAnswer,
        answerNumber: mockAnswerNumber,
      });
    });
  });
});
