import { Component, Input } from '@angular/core';

@Component({
  selector: 'eco-card',
  templateUrl: './eco-card.component.html',
  styleUrls: ['./eco-card.component.scss'],
})
export class ECOCardComponent {
  @Input()
  ecoFaults: string;

  @Input()
  isADI2 = false;

  @Input()
  displaySeperator = false;
}
