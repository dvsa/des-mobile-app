import { Component, Input } from '@angular/core';
import { MotErrorDisplay } from '@providers/mot-details/mot-details';

@Component({
  selector: 'mot-details-display',
  templateUrl: 'mot-details-display.html',
  styleUrls: ['mot-details-display.scss'],
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
