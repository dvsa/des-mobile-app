import { Component, Input } from '@angular/core';

@Component({
  selector: 'eco-card',
  templateUrl: './eco-card.component.html',
  styleUrls: ['./eco-card.component.scss'],
})
export class ECOCardComponent {

  @Input()
  ecoFaults: any;

  @Input()
  ecoDisplay: any;

}
