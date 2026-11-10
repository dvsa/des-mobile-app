import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonText } from '@ionic/angular';

@Component({
  selector: 'fit-marker-banner',
  templateUrl: 'fit-marker-banner.html',
  styleUrls: ['./fit-marker-banner.scss'],
  imports: [IonCard, IonCardHeader, IonText, IonCardContent],
})
export class FitMarkerBannerComponent {
  @Input()
  fitCaseNumber: string;
  @Input()
  isTestResult?: boolean = false;
}
