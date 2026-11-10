import { Component } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';

@Component({
  selector: 'inappropriate-use-banner',
  templateUrl: 'inappropriate-use-banner.html',
  styleUrls: ['inappropriate-use-banner.scss'],
  imports: [IonGrid, IonRow, IonCol, IonIcon],
})
export class InappropriateUseBannerComponent {}
