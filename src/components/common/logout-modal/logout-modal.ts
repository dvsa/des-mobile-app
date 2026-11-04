import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonButton, IonCard, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

export enum LogoutModalEvent {
  LOGOUT = 'logout',
  CANCEL = 'cancel',
}

@Component({
  selector: 'logout-modal',
  templateUrl: './logout-modal.html',
  styleUrls: ['./logout-modal.scss'],
  imports: [IonCard, IonRow, IonCol, IonText, IonButton, AsyncPipe],
})
export class LogoutModal {
  constructor(public modalController: ModalController) {}

  @Input()
  unuploadedTestCount: Observable<number>;

  async onCancel() {
    await this.modalController.dismiss({ event: LogoutModalEvent.CANCEL });
  }
  async onLogout() {
    await this.modalController.dismiss({ event: LogoutModalEvent.LOGOUT });
  }
}
