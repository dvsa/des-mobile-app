import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonCol, IonRow, IonSelect, IonSelectOption } from '@ionic/angular';
import { FaultSummary } from '@shared/models/fault-marking.model';

@Component({
  selector: 'eco-related-fault',
  templateUrl: 'eco-related-fault.html',
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, IonSelect, IonSelectOption],
})
export class EcoRelatedFaultComponent implements OnChanges {
  @Input()
  fuelEfficientDriving: boolean;

  @Input()
  ecoRelatedFault: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  drivingFaults: FaultSummary[];

  @Output()
  ecoFaultChange = new EventEmitter<string>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl('ecoRelatedFault', this.formControl);
    }

    this.formControl.setValidators(
      this.fuelEfficientDriving && this.drivingFaults.length > 0 ? Validators.required : null
    );
    this.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    this.formControl.patchValue(this.ecoRelatedFault, { onlySelf: true, emitEvent: false });
  }

  ecoFaultChanged(ecoFaults: string): void {
    this.ecoFaultChange.emit(ecoFaults);
  }

  trackByIndex = (_: number, fs: FaultSummary) => {
    return `${fs.competencyIdentifier}`;
  };

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
