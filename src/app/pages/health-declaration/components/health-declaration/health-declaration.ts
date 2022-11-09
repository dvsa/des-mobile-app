import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'health-declaration',
  templateUrl: 'health-declaration.html',
  styleUrls: ['health-declaration.scss'],
})
export class HealthDeclarationComponent implements OnChanges {

  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  healthDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'healthCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', []);
      this.formGroup.addControl(HealthDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  healthDeclarationChanged(): void {
    this.healthDeclarationChange.emit();
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
