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

  @Output()
  ecoFaultChange = new EventEmitter<FaultSummary[]>();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl('ecoRelatedFault', this.formControl);
    }
  }

  ecoFaultChanged(ecoFaults: FaultSummary[]): void {
    this.ecoFaultChange.emit(ecoFaults);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
