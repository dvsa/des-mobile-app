import { Component, Input } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

@Component({
  selector: 'dimensions-card',
  templateUrl: 'dimensions.html',
  imports: [IonRow, IonCol, FormatIdPipe],
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
