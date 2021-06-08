import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal {

  onCancel: Function;

  onSave: Function;

  vrnNumber: string;

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onSave = this.navParams.get('onSave');
  }

  vrnChanged(value: string) {
    this.vrnNumber = value;
  }

}
