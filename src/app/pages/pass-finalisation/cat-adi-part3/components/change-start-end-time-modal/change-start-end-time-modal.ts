import { Component, ViewChild } from '@angular/core';
import { TimePickerComponent } from '@components/common/time-picker/time-picker.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'change-start-start-end-time-modal',
  templateUrl: './change-start-end-time-modal.html',
  styleUrls: ['./change-start-end-time-modal.scss'],
})
export class ChangeStartEndTimeModal {
  startTime = '';
  endTime = '';

  constructor(private modalController: ModalController) {}

  @ViewChild('EndTimePicker') endTimePicker!: TimePickerComponent;

  async onCancel() {
    await this.modalController.dismiss();
  }

  async onConfirm() {
    await this.modalController.dismiss({ startTime: this.startTime, endTime: this.endTime });
  }

  changeFocusToEndTime() {
    this.endTimePicker.focusHourInput(true);
  }
}
