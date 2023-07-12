import { Component, Input } from '@angular/core';
import { MotErrorDisplay } from '@providers/vehicle-details-api/vehicle-details-api.service';

@Component({
  selector: 'mot-details-display',
  templateUrl: 'mot-details-display.html',
})
export class MotDetailsDisplay {
  @Input()
  status: string;

  @Input()
  motError: MotErrorDisplay;

  @Input()
  make: string;

  @Input()
  model: string;

  @Input()
  testExpiryDate: string;
}
