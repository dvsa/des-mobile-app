import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'trainee-licence',
  templateUrl: 'trainee-licence.html',
})
export class TraineeLicenceComponent implements OnChanges {

  @Input()
  traineeLicence: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  traineeLicenceChange = new EventEmitter<boolean>();

  formControl: FormControl;
  static readonly fieldName: string = 'traineeLicenceCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
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
