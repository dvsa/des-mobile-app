import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'trainee-licence',
  templateUrl: 'trainee-licence.html',
})
export class TraineeLicenceComponent implements OnChanges {

  @Input()
  traineeLicence: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  traineeLicenceChange = new EventEmitter<boolean>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'traineeLicenceCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(TraineeLicenceComponent.fieldName, this.formControl);
    }

    if (this.traineeLicence === true || this.traineeLicence === false) {
      this.formControl.patchValue(String(this.traineeLicence));
    }
  }

  traineeLicenceChanged(traineeLicence: string): void {
    this.traineeLicenceChange.emit(traineeLicence === 'true');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
