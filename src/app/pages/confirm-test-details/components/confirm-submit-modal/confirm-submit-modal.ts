import {
  ModalController,
} from '@ionic/angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirm-submit-modal',
  templateUrl: './confirm-submit-modal.html',
  styleUrls: ['./confirm-submit-modal.scss'],
})
export class ConfirmSubmitModal {

  onTestDetailsConfirm: Function;
  @Input('testOutcome') testOutcome;
  @Input('category') category;
  @Input('candidateName') candidateName;

  constructor(
    public modalController: ModalController,
  ) {
  }

  ngOnInit(): void {
  }

  onCompleteTest = async () => {
    await this.modalController.dismiss();
    await this.onTestDetailsConfirm;
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
