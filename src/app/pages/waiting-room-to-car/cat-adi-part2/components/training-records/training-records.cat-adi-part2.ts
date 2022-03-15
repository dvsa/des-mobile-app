import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum TrainingRecorded {
  YES = 'Y',
  NO = 'N',
}

@Component({
  selector: 'training-records-cat-adi-part2',
  templateUrl: 'training-records.cat-adi-part2.html',
})
export class TrainingRecordsCatAdiPart2Component {

  @Input()
  trainingRecordRadioChecked: boolean;

  @Input()
  formGroup: FormGroup;

  formControl: FormControl;

  @Output()
  trainingRecordOutcomeChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('trainingRecordCtrl', this.formControl);
    }
    this.formControl.patchValue(this.trainingRecordRadioChecked);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  trainingRecordOutcomeChanged(trainingRecorded: string): void {
    if (this.formControl.valid) {
      this.trainingRecordOutcomeChange.emit(trainingRecorded === TrainingRecorded.YES);
    }
  }

}
