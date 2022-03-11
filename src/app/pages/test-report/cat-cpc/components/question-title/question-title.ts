import { Component, Input } from '@angular/core';
import { Question } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'question-title',
  templateUrl: 'question-title.html',
  styleUrls: ['question-title.scss'],
})
export class QuestionTitleComponent {

  @Input()
  question: Question;

}
