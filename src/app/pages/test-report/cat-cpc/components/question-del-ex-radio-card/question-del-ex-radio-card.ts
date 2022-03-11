import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Question } from '@dvsa/mes-test-schema/categories/CPC';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'question-del-ex-radio-card',
  templateUrl: 'question-del-ex-radio-card.html',
})
export class QuestionDelExRadioCardComponent {

  @Input()
  question: Question;

  @Input()
  questionNumber: number;

  @Input()
  formGroup: FormGroup;

  @Output()
  questionScore = new EventEmitter();

  formControl: FormControl;
  answerArray = [0, 5, 10, 15, 20];

  questionScoreChanged = (value: number): void => {
    this.questionScore.emit({
      questionNumber: this.questionNumber,
      score: value,
    });
  };

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(`cpcQuestion${this.questionNumber}ResultCtrl`, this.formControl);
    }

    if (this.question.score || this.question.score === 0) {
      this.formControl.patchValue(this.question.score.toString());
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
