import { Component, Input } from '@angular/core';

@Component({
  selector: 'dimensions-card',
  templateUrl: 'dimensions.html',
})
export class DimensionsComponent {
  @Input()
  vehicleWidth = 0;

  @Input()
  vehicleHeight = 0;

  @Input()
  vehicleLength = 0;

  @Input()
  numberOfSeats = 0;

  idPrefix = 'vehicle-dimensions';
}
