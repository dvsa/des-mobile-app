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
  onDateChanged(event, dateType: 'start' | 'end') {
    switch (dateType) {
      case 'start':
        this.startDate = event.detail.value;
        this.endDateMin = this.startDate;
        if (new DateTime(this.endDate).isBefore(this.startDate)) {
          this.endDate = this.startDate;
        }
        break;
      case 'end':
        this.endDate = event.detail.value;
        break;
    }
  }

  getHighlightedDates() {
    return new DateTime(this.startDate).getDatesBetweenTwoDates(new DateTime(this.endDate)).map((date: DateTime) => {
      return {
        date: date.format('YYYY-MM-DD'),
        textColor: '#000000',
        backgroundColor: 'rgb(169,210,255)',
      };
    });
  }
}
