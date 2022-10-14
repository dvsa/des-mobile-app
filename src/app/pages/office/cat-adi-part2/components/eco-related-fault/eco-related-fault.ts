import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FaultSummary } from '@shared/models/fault-marking.model';

@Component({
  selector: 'eco-related-fault',
  templateUrl: 'eco-related-fault.html',
})

export class EcoRelatedFaultComponent implements OnChanges {
  @Input()
  formGroup: FormGroup;

  @Input()
  drivingFaults: FaultSummary[];

  @Input()
  ecoRelatedFault: string;

  @Output()
  ecoFaultChange = new EventEmitter<string>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('ecoRelatedFault', this.formControl);
    }

    if (this.ecoRelatedFault) {
      this.formControl.patchValue(this.ecoRelatedFault);
    }
  }

  ecoFaultChanged(ecoFaults: string): void {
    this.ecoFaultChange.emit(ecoFaults);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
