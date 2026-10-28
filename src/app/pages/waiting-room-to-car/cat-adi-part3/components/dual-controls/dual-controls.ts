import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'dual-controls',
  templateUrl: 'dual-controls.html',
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol],
})
export class DualControlsComponent implements OnChanges {
  @Input()
  dualControls: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  dualControlsChange = new EventEmitter<boolean>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'dualControlsCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(DualControlsComponent.fieldName, this.formControl);
    }

    if (this.dualControls === true || this.dualControls === false) {
      this.formControl.patchValue(String(this.dualControls));
    }
  }

  dualControlsChanged(dualControls: string): void {
    this.dualControlsChange.emit(dualControls === 'true');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
