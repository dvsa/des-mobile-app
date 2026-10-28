import { Component, Input } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'application-reference-number',
  templateUrl: './application-reference.html',
  imports: [IonRow, IonCol],
})
export class ApplicationReferenceComponent {
  @Input()
  applicationNumber: string;
}
