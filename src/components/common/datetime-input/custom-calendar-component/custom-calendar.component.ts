import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { DateHeaderComponent } from '@components/common/datetime-input/date-header/date-header.component';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

export class CustomDateAdapter extends NativeDateAdapter {
  //Set first day of the week to Monday
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@Component({
  selector: 'custom-calendar-component',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  imports: [MatCalendar, IonicModule, NgIf],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],

  standalone: true,
})
export class CustomCalendarComponent {
  @ViewChild(MatCalendar) datePicker!: MatCalendar<string>;

  @Input()
  shouldDisplayRange = false;

  @Input()
  otherDateInRange: string;

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

  @Input()
  showCancelAndConfirm = true;

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime | string }>();

  @Output()
  onDataPicked = new EventEmitter<DateTime>();

  dateClass: MatCalendarCellClassFunction<string> = (
    date: string,
    view: 'month' | 'year' | 'multi-year'
  ): MatCalendarCellCssClasses => {
    if (view === 'month') {
      if (this.shouldDisplayRange && this.otherDateInRange) {
        if (date === this.otherDateInRange || date === this.selectedBuffer || date === this.selectedValue) {
          return 'mat-calendar-body-selected';
        }
        if (
          new DateTime(date).isBetweenTwoDates(new DateTime(this.selectedBuffer), new DateTime(this.otherDateInRange))
        ) {
          return 'mat-calendar-body-in-range';
        }
      }
    }
  };

  getDateClass() {
    return this.dateClass;
  }

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
    if (!this.showCancelAndConfirm) {
      this.onSelected(event);
    }
  }

  /**
   * Handles the back button action.
   */
  handleBackButton() {
    if (this.selectedValue) {
      this.datePicker.activeDate = this.selectedValue;
    } else {
      this.datePicker.activeDate = this.selectedBuffer ? this.selectedBuffer : this.datePicker.maxDate;
    }
  }

  onSelected(event: string) {
    this.selectedValue = this.selectedBuffer ? this.selectedBuffer : event;

    this.onDataPicked.emit(DateTime.at(this.selectedValue));
  }

  protected readonly DateHeaderComponent = DateHeaderComponent;
}
