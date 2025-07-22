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
  @ViewChild('ContinueButton', { read: ElementRef }) confirmButton!: ElementRef<HTMLButtonElement>;
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

  /**
   * Changes focus to the confirm button and adds the ion-focused class if it is not already present.
   */
  changeFocusToConfirmButton() {
    this.confirmButton.nativeElement.focus();
    //If the button does not have the ion-focused class, we need to manually add it (without this, the button will not be visually focused)
    if (!this.confirmButton.nativeElement.classList.contains('ion-focused')) {
      this.confirmButton.nativeElement.classList.add('ion-focused');
    }
  }

  /**
   * Changes focus to the cancel button and adds the ion-focused class if it is not already present.
   */
  changeFocusToCancelButton() {
    this.cancelButton.nativeElement.focus();
    //If the button does not have the ion-focused class, we need to manually add it (without this, the button will not be visually focused)
    if (!this.cancelButton.nativeElement.classList.contains('ion-focused')) {
      this.cancelButton.nativeElement.classList.add('ion-focused');
    }
  }

  /**
   * Removes the ion-focused class from the button that is being unfocused.
   * @param button - The button that is being unfocused, either 'cancel' or 'confirm'.
   */
  removeFocusedClass(button: 'cancel' | 'confirm') {
    console.log('Removing focused class from button', button);
    // Remove the ion-focused class from the button that is being unfocused (without this, the button will still be visually focused)
    const buttonToUnfocus: ElementRef<HTMLButtonElement> = button === 'cancel' ? this.cancelButton : this.confirmButton;
    console.log(buttonToUnfocus.nativeElement.classList.contains('ion-focused'));
    if (buttonToUnfocus.nativeElement.classList.contains('ion-focused')) {
      buttonToUnfocus?.nativeElement?.classList.remove('ion-focused');
    }
  }
}
