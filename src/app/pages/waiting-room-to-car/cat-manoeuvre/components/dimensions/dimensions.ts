import { Component, Input } from '@angular/core';

@Component({
  selector: 'dimensions-card',
  templateUrl: 'dimensions.html',
})
export class DimensionsComponent {
  @Input()
  vehicleWidth: number = 0;

  @Input()
  vehicleHeight: number = 0;

  @Input()
  vehicleLength: number = 0;

  @Input()
  numberOfSeats: number = 0;

  idPrefix = 'vehicle-dimensions';
}
