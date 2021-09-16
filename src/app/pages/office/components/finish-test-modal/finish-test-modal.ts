import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'finish-test-modal',
  templateUrl: './finish-test-modal.html',
  styleUrls: ['./finish-test-modal.scss'],
})
export class FinishTestModal implements OnInit {

  constructor(
    public modalController: ModalController,
  ) {
  }

  ngOnInit(): void {
  }

  onCompleteTest = async () => {
  };

  onCancel = async () => {
  };
}
