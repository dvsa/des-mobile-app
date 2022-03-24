import { Component, Input } from '@angular/core';

@Component({
  selector: 'question-score',
  templateUrl: 'question-score.html',
  styleUrls: ['question-score.scss'],
})
export class QuestionScoreComponent {

  @Input()
  score: number;

}
