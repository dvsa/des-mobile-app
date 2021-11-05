import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UploadRekeyModalEvent } from './upload-rekey-modal.constants';

@Component({
  selector: 'upload-rekey-modal',
  templateUrl: 'upload-rekey-modal.html',
  styleUrls: ['upload-rekey-modal.scss'],
})
export class UploadRekeyModal {

  retryMode: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    public params: NavParams,
  ) {
    this.retryMode = params.get('retryMode');
  }

  async onCancel(): Promise<void> {
    await this.modalCtrl.dismiss(UploadRekeyModalEvent.CANCEL);
  }

  async onUpload(): Promise<void> {
    await this.modalCtrl.dismiss(UploadRekeyModalEvent.UPLOAD);
  }

}
