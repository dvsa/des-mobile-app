import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'health-declaration',
  templateUrl: 'health-declaration.html',
})
export class HealthDeclarationComponent implements OnChanges {

  @Input()
  selected: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  healthDeclarationChange = new EventEmitter();

  formControl: FormControl;
  static readonly fieldName: string = 'healthCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', []),

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
