import { Component, Input } from '@angular/core';
import { IonRow } from '@ionic/angular';

@Component({
  selector: 'question-subtitle',
  templateUrl: 'question-subtitle.html',
  styleUrls: ['question-subtitle.scss'],
  imports: [IonRow],
})
export class QuestionSubtitleComponent {
  @Input()
  subtitle: string;
}
