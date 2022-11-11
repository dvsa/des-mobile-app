import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

@Component({
  selector: 'tell-me-question',
  templateUrl: './tell-me-question.html',
  styleUrls: ['./tell-me-question.scss'],
})
export class TellMeQuestionComponent implements OnChanges {

  @Input()
  tellMeQuestion: VehicleChecksQuestion;

  @Input()
  tellMeQuestions: VehicleChecksQuestion[];

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  tellMeQuestionChange = new EventEmitter<VehicleChecksQuestion>();

  public formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('TellMeQuestion', [Validators.required]);
      this.formGroup.addControl('tellMeQuestion', this.formControl);
    }
    this.formControl.patchValue(this.tellMeQuestion);
  }

  tellMeQuestionChanged(tellMeQuestion: VehicleChecksQuestion): void {
    if (this.formControl.valid) {
      this.tellMeQuestionChange.emit(tellMeQuestion);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
