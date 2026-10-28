import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';

@Component({
  selector: 'warning-banner',
  templateUrl: 'warning-banner.html',
  styleUrls: ['warning-banner.scss'],
  imports: [IonGrid, IonRow, IonCol, IonIcon],
})
export class WarningBannerComponent {
  @Input()
  warningIdentifier?: string = null;

  @Input()
  warningText: string;
}
