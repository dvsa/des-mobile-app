import { Component } from '@angular/core';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'modal-activity-code-list',
  templateUrl: './modal-activity-code-list.html',
  styleUrls: ['./modal-activity-code-list.scss'],
})
export class ModalActivityCodeListComponent {

  activityCodeModel: ActivityCodeModel;
  activityCodeOptions: ActivityCodeModel[];
  onCancel: Function;

  constructor(
    private navParams: NavParams,
  ) {
    // this.onCancel = this.navParams.get('onCancel');
    this.onCancel = this.navParams.get('onCancel');
  }
}
