import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'eco-card',
  templateUrl: './eco-card.component.html',
  styleUrls: ['./eco-card.component.scss'],
  imports: [IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText],
})
export class ECOCardComponent {
  @Input()
  ecoFaults: string;

  @Input()
  isADI2 = false;

  @Input()
  displaySeperator = false;
}
