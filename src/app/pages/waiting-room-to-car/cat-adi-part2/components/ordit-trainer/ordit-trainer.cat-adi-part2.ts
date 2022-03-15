import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum OrditTrained {
  YES = 'Y',
  NO = 'N',
}

@Component({
  selector: 'ordit-trainer-cat-adi-part2',
  templateUrl: 'ordit-trainer.cat-adi-part2.html',
})
export class OrditTrainerCatAdiPart2Component {

  @Input()
  orditTrainedRadioChecked: boolean;

  @Input()
  formGroup: FormGroup;

  formControl: FormControl;

  @Output()
  orditTrainedOutcomeChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('orditTrainedCtrl', this.formControl);
    }
    this.formControl.patchValue(this.orditTrainedRadioChecked);
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
