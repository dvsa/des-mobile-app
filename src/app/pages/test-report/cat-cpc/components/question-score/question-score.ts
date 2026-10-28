import { Component, Input } from '@angular/core';
import { IonCol, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'question-score',
  templateUrl: 'question-score.html',
  styleUrls: ['question-score.scss'],
  imports: [IonRow, IonCol, IonText],
})
export class QuestionScoreComponent {
  @Input()
  score: number | string;

  @Input()
  displayPercentage?: boolean = true;

  @Input()
  label?: string = 'Total:';
}
