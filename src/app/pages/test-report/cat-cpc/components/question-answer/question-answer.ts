import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Answer } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'question-answer',
  templateUrl: 'question-answer.html',
  styleUrls: ['question-answer.scss'],
})
export class QuestionAnswerComponent {

  @Input()
  answer: Answer;

  @Input()
  answerNumber: string;

  @Output()
  answerToggled = new EventEmitter();

  getID = (answerNumber: string): string => `answer${answerNumber}`;

  getLabel = (answerNumber: string): string => `answer-label-${answerNumber}`;

  answerChanged = (): void => {
    this.answerToggled.emit({
      answer: this.answer,
      answerNumber: this.answerNumber,
    });
  };

}
