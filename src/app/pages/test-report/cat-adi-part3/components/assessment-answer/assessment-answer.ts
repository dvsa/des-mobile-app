import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'assessment-answer',
  templateUrl: 'assessment-answer.html',
  styleUrls: ['assessment-answer.scss'],
  imports: [IonRow, IonCol],
})
export class AssessmentAnswerComponent {
  @Input()
  radio = false;

  @Input()
  assessmentLabel: string;

  @Input()
  key: string;

  @Input()
  comparator: string;

  @Output()
  answerToggled = new EventEmitter<string>();

  valueChanged = (key: string): void => {
    this.answerToggled.emit(key);
  };
}
