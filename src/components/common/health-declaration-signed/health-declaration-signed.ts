import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

export enum HealthDeclatationValidValues {
  SIGNED = 'Signed',
  NOTSIGNED = 'NotSigned',
}

@Component({
  selector: 'health-declaration-signed',
  templateUrl: 'health-declaration-signed.html',
})
export class HealthDeclarationSignedComponent implements OnChanges {

  @Input()
  healthDeclaration: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  label: string;

  @Output()
  healthDeclarationChange = new EventEmitter<boolean>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'healthDeclarationCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(HealthDeclarationSignedComponent.fieldName, this.formControl);

      // set to null on form creation to allow validation to fire if no user interaction
      if (!this.healthDeclaration) this.healthDeclaration = null;
      return this.formControl.patchValue(this.healthDeclaration);
    }
    this.formControl.patchValue(
      this.healthDeclaration ? HealthDeclatationValidValues.SIGNED : HealthDeclatationValidValues.NOTSIGNED,
    );
  }

  healthDeclarationChanged(healthFormValue: string): void {
    this.healthDeclarationChange.emit(healthFormValue === HealthDeclatationValidValues.SIGNED);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
