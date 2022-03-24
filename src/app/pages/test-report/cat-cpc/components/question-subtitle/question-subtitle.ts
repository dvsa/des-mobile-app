import { Component, Input } from '@angular/core';

@Component({
  selector: 'question-subtitle',
  templateUrl: 'question-subtitle.html',
  styleUrls: ['question-subtitle.scss'],
})
export class QuestionSubtitleComponent {

  @Input()
  subtitle: string;

}
