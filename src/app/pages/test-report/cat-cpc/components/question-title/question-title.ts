import { Component, Input } from '@angular/core';
import { Question } from '@dvsa/mes-test-schema/categories/CPC';
import { IonCardHeader } from '@ionic/angular';

@Component({
  selector: 'question-title',
  templateUrl: 'question-title.html',
  styleUrls: ['question-title.scss'],
  imports: [IonCardHeader],
})
export class QuestionTitleComponent {
  @Input()
  question: Question;
}
