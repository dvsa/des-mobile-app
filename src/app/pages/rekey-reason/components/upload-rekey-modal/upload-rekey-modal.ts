import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UploadRekeyModalEvent } from './upload-rekey-modal.constants';

@Component({
  selector: 'upload-rekey-modal',
  templateUrl: 'upload-rekey-modal.html',
  styleUrls: ['upload-rekey-modal.scss'],
})
export class UploadRekeyModal {
  @Input()
  retryMode = false;

  constructor(private modalCtrl: ModalController) {}

  async onCancel(): Promise<void> {
    await this.modalCtrl.dismiss(UploadRekeyModalEvent.CANCEL);
  }

  async onUpload(): Promise<void> {
    await this.modalCtrl.dismiss(UploadRekeyModalEvent.UPLOAD);
  }
}
