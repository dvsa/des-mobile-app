import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'residency-declaration',
  templateUrl: 'residency-declaration.html',
  styleUrls: ['residency-declaration.scss'],
})
export class ResidencyDeclarationComponent implements OnChanges {

  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  residencyDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'residencyCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(ResidencyDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  residencyDeclarationChanged(): void {
    this.residencyDeclarationChange.emit();
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
