import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimePickerComponent } from '@components/common/time-picker/time-picker.component';
import { ModalController } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

@Component({
  selector: 'change-start-start-end-time-modal',
  templateUrl: './change-start-end-time-modal.html',
  styleUrls: ['./change-start-end-time-modal.scss'],
})
export class ChangeStartEndTimeModal {
  startTime = '';
  endTime = '';

  constructor(public modalController: ModalController) {}

  @ViewChild('EndTimePicker') endTimePicker!: TimePickerComponent;
  @ViewChild('StartTimePicker') startTimePicker!: TimePickerComponent;
  @ViewChild('CancelButton', { read: ElementRef }) cancelButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('modalContainer', { read: ElementRef }) modalContainer!: ElementRef<HTMLElement>;

  async ionViewDidEnter() {
    // Set initial focus to the modal container so tabbing takes the user to the start time picker
    this.modalContainer.nativeElement.focus();
  }

  async onCancel() {
    await this.modalController.dismiss();
  }

  async onConfirm() {
    await this.modalController.dismiss({ startTime: this.startTime, endTime: this.endTime });
  }

  async changeFocusToEndTime(shouldErase: boolean) {
    await this.endTimePicker.focusHourInput(shouldErase);
  }

  async changeFocusToStartTime(shouldErase: boolean) {
    await this.startTimePicker.focusMinuteInput(shouldErase, true);
  }

  async loopFocusToStartTime(event: Event) {
    if (event) {
      event.preventDefault();
    }
    await this.startTimePicker.focusHourInput(false, true);
  }

  invalid() {
    return new DateTime(this.startTime) > new DateTime(this.endTime);
  }

  changeFocusToButtons() {
    this.cancelButton.nativeElement.focus();
  }
}
