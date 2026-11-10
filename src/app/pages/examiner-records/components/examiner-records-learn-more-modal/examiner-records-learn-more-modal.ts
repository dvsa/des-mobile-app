import { Component } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';

@Component({
  selector: 'examiner-records-learn-more-modal',
  templateUrl: 'examiner-records-learn-more-modal.html',
  styleUrls: ['examiner-records-learn-more-modal.scss'],
  imports: [
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonContent,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class ExaminerRecordsLearnMoreModal {
  constructor(public modalCtrl: ModalController) {}

  async onOk() {
    await this.modalCtrl.dismiss();
  }
}
