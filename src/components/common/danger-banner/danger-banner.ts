import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';

@Component({
  selector: 'danger-banner',
  templateUrl: 'danger-banner.html',
  styleUrls: ['danger-banner.scss'],
  imports: [IonGrid, IonRow, IonCol, IonIcon],
})
export class DangerBannerComponent {
  @Input()
  dangerText: string;
}
