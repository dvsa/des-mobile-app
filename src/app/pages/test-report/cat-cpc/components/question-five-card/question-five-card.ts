import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow } from '@ionic/angular';
import { QuestionAnswerComponent } from '../question-answer/question-answer';
import { AnswerChanged } from '../question-card/question-card';
import { QuestionScoreComponent } from '../question-score/question-score';
import { QuestionSubtitleComponent } from '../question-subtitle/question-subtitle';
import { QuestionTitleComponent } from '../question-title/question-title';

@Component({
  selector: 'question-five-card',
  templateUrl: 'question-five-card.html',
  styleUrls: ['question-five-card.scss'],
  imports: [
    IonCard,
    QuestionTitleComponent,
    IonCardContent,
    IonGrid,
    QuestionSubtitleComponent,
    IonRow,
    IonCol,
    QuestionAnswerComponent,
    QuestionScoreComponent,
  ],
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
