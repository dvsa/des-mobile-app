import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { AnswerChanged } from '../question-card/question-card';

@Component({
  selector: 'question-five-card',
  templateUrl: 'question-five-card.html',
  styleUrls: ['question-five-card.scss'],
})
export class QuestionFiveCardComponent {

  @Input()
  question: Question5;

  @Output()
  answerPayload = new EventEmitter();

  answerChanged = (details: AnswerChanged): void => {
    this.answerPayload.emit({ questionNumber: 5, ...details });
  };

}
