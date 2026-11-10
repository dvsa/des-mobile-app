import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonRow, ModalController } from '@ionic/angular';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { get } from 'lodash-es';

@Component({
  selector: 'modal-activity-code-list',
  templateUrl: './modal-activity-code-list.html',
  styleUrls: ['./modal-activity-code-list.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, NgClass, IonIcon, IonButton, FormatIdPipe],
})
export class ModalActivityCodeListComponent {
  activityCodeModel: ActivityCodeModel;
  activityCodeOptions: ActivityCodeModel[];
  idPrefix = 'activity-code-modal';

  constructor(public modalController: ModalController) {}

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(null, ActivityCodeModalEvent.CANCEL);
  };

  isOptionDisabled = (activityCode: ActivityCode): boolean =>
    Number.parseInt(activityCode, 10) < 4 ||
    Number.parseInt(activityCode, 10) === Number.parseInt(ActivityCodes.MOT_INVALID);

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

  trackByActivityCode = (_: number, activityCode: ActivityCodeModel) => get(activityCode, 'activityCode', null);
}
