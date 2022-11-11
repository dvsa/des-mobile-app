import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'full-licence-held-toggle',
  templateUrl: 'full-licence-held-toggle.html',
})
export class FullLicenceHeldComponent implements OnChanges {

  @Input()
  testCategory: TestCategory;

  @Input()
  fullLicenceHeld: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  required: boolean = false;

  @Output()
  fullLicenceHeldChange = new EventEmitter<boolean>();

  static formControlName: string = 'fullLicenceHeldCtrl';

  private formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, this.required ? [Validators.required] : []);
      this.formGroup.addControl(FullLicenceHeldComponent.formControlName, this.formControl);
    }
    this.formControl.patchValue(this.fullLicenceHeld);
  }

  fullLicenceHeldChanged(licenceHeld: 'Y' | 'N'): void {
    this.fullLicenceHeldChange.emit(licenceHeld === 'Y');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
