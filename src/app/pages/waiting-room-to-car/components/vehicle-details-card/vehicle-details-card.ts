import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details';

@Component({
  selector: 'vehicle-details-card',
  templateUrl: 'vehicle-details-card.html',
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, VehicleDetailsComponent],
})
export class VehicleDetailsCardComponent {
  @Input()
  schoolVehicleDetails: boolean;

  @Input()
  dualVehicleDetails: boolean;

  @Input()
  schoolBikeVehicleDetails: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  hideSchoolVehicleAndDualControlRow = false;

  @Input()
  hideSchoolBikeRow = true;

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
