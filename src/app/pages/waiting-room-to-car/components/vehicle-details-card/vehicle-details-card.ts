import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vehicle-details-card',
  templateUrl: 'vehicle-details-card.html',
})
export class VehicleDetailsCardComponent {

  @Input()
  schoolVehicleDetails: boolean;

  @Input()
  dualVehicleDetails: boolean;

  @Input()
  schoolBikeVehicleDetails: boolean;

  @Input()
  formGroup: FormGroup;

  @Input()
  hideSchoolVehicleAndDualControlRow: boolean = false;

  @Input()
  hideSchoolBikeRow: boolean = true;

  @Output()
  schoolVehicleDetailsChange = new EventEmitter();

  @Output()
  dualVehicleDetailsChange = new EventEmitter();

  @Output()
  schoolBikeVehicleDetailsChange = new EventEmitter();

  schoolVehicleDetailsChanged(): void {
    this.schoolVehicleDetailsChange.emit();
  }

  dualVehicleDetailsChanged(): void {
    this.dualVehicleDetailsChange.emit();
  }

  schoolBikeVehicleDetailsChanged(): void {
    this.schoolBikeVehicleDetailsChange.emit();
  }

}
