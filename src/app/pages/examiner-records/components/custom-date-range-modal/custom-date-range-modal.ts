import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

@Component({
  selector: 'custom-date-range-modal',
  templateUrl: 'custom-date-range-modal.html',
  styleUrls: ['custom-date-range-modal.scss'],
})
export class CustomDateRangeModal {
  constructor(public modalCtrl: ModalController) {}

  @Input()
  startDate: string;
  @Input()
  endDate: string;

  @Input()
  startDateMin: string;
  @Input()
  startDateMax: string;

  @Input()
  endDateMin: string;
  @Input()
  endDateMax: string;

  async onCancel() {
    await this.modalCtrl.dismiss();
  }

  async onConfirm() {
    await this.modalCtrl.dismiss({
      startDate: new DateTime(this.startDate),
      endDate: new DateTime(this.endDate),
    });
  }

  /**
   * Handles the date change event for the start and end dates.
   *
   * @param event - The event object containing the new date value.
   * @param dateType - The type of date being changed ('start' or 'end').
   */
  onDateChanged(event: DateTime, dateType: 'start' | 'end') {
    switch (dateType) {
      case 'start':
        // Set the start date and update the minimum end date
        this.startDate = event.format('YYYY-MM-DD');
        this.endDateMin = this.startDate;
        // Ensure the end date is not before the start date
        if (new DateTime(this.endDate).isBefore(this.startDate)) {
          this.endDate = this.startDate;
        }
        break;
      case 'end':
        // Set the end date
        this.endDate = event.format('YYYY-MM-DD');
        break;
    }
  }
}
