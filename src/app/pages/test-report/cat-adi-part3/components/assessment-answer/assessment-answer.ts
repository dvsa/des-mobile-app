import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';

@Component({
  selector: 'assessment-answer',
  templateUrl: 'assessment-answer.html',
  styleUrls: ['assessment-answer.scss'],
})
export class AssessmentAnswerComponent {

  @Input()
  radio: boolean = false;

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
