import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

export enum ExitSAMModalEvent {
  EXIT = 'exit',
  CANCEL = 'cancel',
}

@Component({
  selector: 'exit-sam-modal',
  templateUrl: './exit-sam-modal.html',
  styleUrls: ['./exit-sam-modal.scss'],
})
export class ExitSamModal {
  constructor(public modalController: ModalController) {}

  @Input()
  unuploadedTestCount: Observable<number>;

  async onCancel() {
    await this.modalController.dismiss({ event: ExitSAMModalEvent.CANCEL });
  }
  async onExit() {
    await this.modalController.dismiss({ event: ExitSAMModalEvent.EXIT });
  }
}
