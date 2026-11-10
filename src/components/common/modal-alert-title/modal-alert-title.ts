import { Component } from '@angular/core';
import { IonCol, IonIcon, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'modal-alert-title',
  templateUrl: './modal-alert-title.html',
  styleUrls: ['./modal-alert-title.scss'],
  imports: [IonRow, IonCol, IonIcon, IonText],
})
export class ModalAlertTitleComponent {}
