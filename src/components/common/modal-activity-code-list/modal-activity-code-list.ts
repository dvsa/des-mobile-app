import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';

@Component({
  selector: 'modal-activity-code-list',
  templateUrl: './modal-activity-code-list.html',
  styleUrls: ['./modal-activity-code-list.scss'],
})
export class ModalActivityCodeListComponent {

  activityCodeModel: ActivityCodeModel;
  activityCodeOptions: ActivityCodeModel[];
  idPrefix: string = 'activity-code-modal';

  constructor(
    private modalController: ModalController,
  ) {
  }

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(null, ActivityCodeModalEvent.CANCEL);
  };

  isOptionDisabled = (activityCode: ActivityCode): boolean => parseInt(activityCode, 10) < 4;

  selectActivityCode = async (activityCodeModel: ActivityCodeModel): Promise<void> => {
    if (this.isOptionDisabled(activityCodeModel.activityCode)) {
      return;
    }
    await this.modalController.dismiss(activityCodeModel, ActivityCodeModalEvent.SELECT_CODE);
  };

  conditionalStyles = (activityCode: ActivityCodeModel) => ({
    selected: this.isActiveActivityCode(activityCode.activityCode),
    disabled: this.isOptionDisabled(activityCode.activityCode),
    'button-style': true,
  });

  isActiveActivityCode = (activityCode: ActivityCode): boolean => activityCode === this.activityCodeModel?.activityCode;
}
