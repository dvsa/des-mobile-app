import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Answer, Question } from '@dvsa/mes-test-schema/categories/CPC';
import { IonCard, IonCardContent, IonGrid } from '@ionic/angular';
import { AdditionalItemsComponent } from '../additional-items/additional-items';
import { QuestionAnswerComponent } from '../question-answer/question-answer';
import { QuestionScoreComponent } from '../question-score/question-score';
import { QuestionSubtitleComponent } from '../question-subtitle/question-subtitle';
import { QuestionTitleComponent } from '../question-title/question-title';

export type AnswerChanged = {
  answer: Answer;
  answerNumber: string;
};

@Component({
  selector: 'question-card',
  templateUrl: 'question-card.html',
  styleUrls: ['question-card.scss'],
  imports: [
    IonCard,
    QuestionTitleComponent,
    IonCardContent,
    IonGrid,
    QuestionSubtitleComponent,
    AdditionalItemsComponent,
    QuestionAnswerComponent,
    QuestionScoreComponent,
  ],
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
