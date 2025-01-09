import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { DateHeaderComponent } from '@components/common/datetime-input/date-header/date-header.component';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

@Component({
  selector: 'custom-calendar-component',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  imports: [MatCalendar, IonicModule, NgIf],
  standalone: true,
})
export class CustomCalendarComponent {
  @ViewChild(MatCalendar) datePicker!: MatCalendar<string>;

  @Input()
  customTitle: string;

  @Input()
  maxValue: string;

  @Input()
  minValue: string;

  @Input()
  selectedBuffer: string;

  @Input()
  selectedValue: string;

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime | string }>();

  @Output()
  onDataPicked = new EventEmitter<DateTime>();

  /**
   * Handles the selection of a month.
   * @param {string} event - The selected date in string format.
   * @param {string} minDate - The minimum date allowed in string format.
   */
  handleMonthSelected(event: string, minDate: string) {
    const selected = DateTime.at(this.selectedBuffer ? this.selectedBuffer : '');
    const current = DateTime.at(event);
    const minimum = DateTime.at(minDate);

    if (!(current.month() === selected.month() && current.year() === selected.year())) {
      if (current.format('YYYY-MM-DD') < minimum.format('YYYY-MM-DD')) {
        this.selectedBuffer = minDate;
      } else {
        this.selectedBuffer = event;
      }
    }
  }

  /**
   * Emits a custom button event.
   * @param {IonDatetime | string} dateTime - The date/time or string to emit.
   * @param {string} buttonType - The type of button event.
   */
  buttonEmit(dateTime: IonDatetime | string, buttonType: string) {
    if (buttonType !== 'back') {
      this.selectedBuffer = null;
    }
    this.customButtonEvent.emit({
      buttonType,
      data: dateTime,
    });
  }

  /**
   * Handles the change of the selected date.
   * @param {any} event - The event containing the new selected date.
   */
  onSelectedChange(event) {
    this.selectedBuffer = event;
  }

  /**
   * Handles the back button action.
   * @returns {'month'} - Returns the string 'month'.
   */
  handleBackButton(): 'month' {
    if (this.selectedValue) {
      this.datePicker.activeDate = this.selectedValue;
    } else {
      this.datePicker.activeDate = this.selectedBuffer ? this.selectedBuffer : this.datePicker.maxDate;
    }
    return 'month';
  }

  onSelected(event: string) {
    this.selectedValue = this.selectedBuffer ? this.selectedBuffer : event;

    this.onDataPicked.emit(DateTime.at(this.selectedValue));
  }

  protected readonly DateHeaderComponent = DateHeaderComponent;
}
