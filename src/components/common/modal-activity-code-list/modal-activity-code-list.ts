import { Component } from '@angular/core';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ModalController } from '@ionic/angular';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';

@Component({
  selector: 'modal-activity-code-list',
  templateUrl: './modal-activity-code-list.html',
  styleUrls: ['./modal-activity-code-list.scss'],
})
export class ModalActivityCodeListComponent {

  activityCodeModel: ActivityCodeModel;
  activityCodeOptions: ActivityCodeModel[];

  constructor(
    private modalController: ModalController,
  ) {
  }

  onCancel = async () => {
    await this.modalController.dismiss(null, ActivityCodeModalEvent.CANCEL);
  };

  isOptionDisabled(activityCode: ActivityCode): boolean {
    return parseInt(activityCode, 10) < 4;
  }

  selectActivityCode = async (activityCodeModel: ActivityCodeModel) => {
    await this.modalController.dismiss(activityCodeModel, ActivityCodeModalEvent.SELECT_CODE);
  };
}
