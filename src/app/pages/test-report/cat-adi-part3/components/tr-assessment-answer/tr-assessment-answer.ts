import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';

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
  answer: number;

  @Output()
  answerChanged = new EventEmitter<string>();

  valueChanged = (key: string): void => {
    this.answerChanged.emit((Number(key) === this.answer) ? null : key);
  };

}
