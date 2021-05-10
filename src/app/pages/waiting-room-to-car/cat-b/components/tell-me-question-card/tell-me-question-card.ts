import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

@Component({
  selector: 'tell-me-question-card',
  templateUrl: './tell-me-question-card.html',
  styleUrls: ['./tell-me-question-card.scss'],
})
export class TellMeQuestionCardComponent {

  questionFormControl: FormControl;
  outcomeFormControl: FormControl;
  questionValid: boolean = true;
  outcomeValid: boolean = true;

  @Input()
  formGroup: FormGroup;

  @Input()
  tellMeQuestion: VehicleChecksQuestion;

  @Input()
  tellMeQuestions: VehicleChecksQuestion[];

  @Input()
  tellMeQuestionOutcome: string;

  @Input()
  tellMeQuestionSelected: boolean;

  @Output()
  tellMeQuestionChange = new EventEmitter<VehicleChecksQuestion>();

  @Output()
  tellMeQuestionOutcomeChange = new EventEmitter<string>();

  get questionInvalid(): boolean {
    const question = this.formGroup.get('tellMeQuestion');
    if (!question) {
      return false;
    }
    return !question.valid && question.dirty;
  }

  get outcomeInvalid(): boolean {
    const outcome = this.formGroup.get('tellMeQuestionOutcome');
    if (!outcome) {
      return false;
    }
    return !outcome.valid && outcome.dirty;
  }

  tellMeQuestionChanged(tellMeQuestion: VehicleChecksQuestion) {
    this.tellMeQuestionChange.emit(tellMeQuestion);
  }

  tellMeQuestionOutcomeChanged(outcome: string) {
    this.tellMeQuestionOutcomeChange.emit(outcome);
  }
}
