import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'examiner-records-learn-more-modal',
  templateUrl: 'examiner-records-learn-more-modal.html',
  styleUrls: ['examiner-records-learn-more-modal.scss'],
  standalone: false,
})
export class ExaminerRecordsLearnMoreModal {
  constructor(public modalCtrl: ModalController) {}

  async onOk() {
    await this.modalCtrl.dismiss();
  }
}
