import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

enum OrditTrained {
  YES = 'true',
  NO = 'false',
}

@Component({
  selector: 'ordit-trainer-cat-adi-part2',
  templateUrl: 'ordit-trainer.cat-adi-part2.html',
})
export class OrditTrainerCatAdiPart2Component {
  @Input()
  orditTrainedRadioChecked: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  notSC = true;

  formControl: UntypedFormControl;

  @Output()
  orditTrainedOutcomeChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl('orditTrainedCtrl', this.formControl);
    }
    if (this.orditTrainedRadioChecked === true || this.orditTrainedRadioChecked === false) {
      this.formControl.patchValue(String(this.orditTrainedRadioChecked));
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  orditTrainingOutcomeChanged(orditTrained: string): void {
    if (this.formControl.valid) {
      this.orditTrainedOutcomeChange.emit(orditTrained === OrditTrained.YES);
    }
  }
}
