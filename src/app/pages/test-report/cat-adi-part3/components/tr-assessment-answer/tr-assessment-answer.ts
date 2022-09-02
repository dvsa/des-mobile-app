import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { isAnyOf } from '@shared/helpers/simplifiers';

@Component({
  selector: 'tr-assessment-answer',
  templateUrl: 'tr-assessment-answer.html',
})
export class TestReportAssessmentAnswer {

  @Input()
  question: string;

  @Input()
  questionNumber: number;

  @Input()
  card: string;

  @Input()
  showMissing: boolean = false;

  @Input()
  answer: number;

  @Output()
  answerChanged = new EventEmitter<string>();

  valueChanged = (key: string): void => {
    this.answerChanged.emit((Number(key) === this.answer) ? null : key);
  };

  hasBeenMissed = (): boolean => this.showMissing && !this.hasValue();

  hasValue = (): boolean => isAnyOf(this.answer, [0, 1, 2, 3]);

  errorHighlighting = () => ({
    'ng-dirty': this.hasBeenMissed(),
    'ng-invalid': this.hasBeenMissed(),
  });

}
