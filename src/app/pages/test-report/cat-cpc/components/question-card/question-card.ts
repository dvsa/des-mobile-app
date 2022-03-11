import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Answer, Question } from '@dvsa/mes-test-schema/categories/CPC';

export type AnswerChanged = {
  answer: Answer;
  answerNumber: string;
};

@Component({
  selector: 'question-card',
  templateUrl: 'question-card.html',
  styleUrls: ['question-card.scss'],
})
export class QuestionCardComponent {

  @Input()
  question: Question;

  @Input()
  questionNumber: number;

  @Output()
  answerPayload = new EventEmitter();

  answerChanged = (details: AnswerChanged): void => {
    this.answerPayload.emit({ questionNumber: this.questionNumber, ...details });
  };

}
