import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IonCol, IonRow, IonSpinner, IonText } from '@ionic/angular';

@Component({
  selector: 'licence-photo',
  templateUrl: 'licence-photo.html',
  styleUrls: ['licence-photo.scss'],
  imports: [IonRow, IonCol, IonSpinner, IonText],
})
export class LicencePhoto {
  @Input()
  imageSrc: SafeUrl | string;

  @Input()
  hasError = false;
}
