import { Component } from '@angular/core';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { NavParams } from '@ionic/angular';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'modal-activity-code-list',
  templateUrl: './modal-activity-code-list.html',
  styleUrls: ['./modal-activity-code-list.scss'],
})
export class ModalActivityCodeListComponent {

  activityCodeModel: ActivityCodeModel;
  activityCodeOptions: ActivityCodeModel[];
  onCancel: Function;
  activityCodeChanged: Function;

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
  }

  isOptionDisabled(activityCode: ActivityCode): boolean {
    return parseInt(activityCode, 10) < 4;
  }

  selectActivityCode(activityCode: ActivityCode) {
    console.log('activityCode: ActivityCode', activityCode);
  }
}
