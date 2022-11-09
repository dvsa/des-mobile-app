import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'insurance-declaration',
  templateUrl: 'insurance-declaration.html',
  styleUrls: ['insurance-declaration.scss'],
})
export class InsuranceDeclarationComponent implements OnChanges {

  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  insuranceDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'insuranceCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(InsuranceDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  insuranceDeclarationChanged(): void {
    this.insuranceDeclarationChange.emit();
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
