import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { DateHeaderComponent } from '@components/common/datetime-input/date-header/date-header.component';
import { IonDatetime } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

export enum DisplayType {
  Date = 'date',
  Time = 'time',
}

@Component({
  selector: 'datetime-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DateTimeInputComponent {
  @ViewChild(MatCalendar) datePicker!: MatCalendar<string>;

  @Input()
  maxValue?: string;

  @Input()
  customTitle?: string;

  @Input()
  minValue?: string;

  @Input()
  displayType: DisplayType;

  @Input()
  initialValue?: string;

  @Input()
  control?: string;

  @Input()
  inputId?: string;

  @Input()
  pickerId?: string;

  @Input()
  showClearButton?: boolean;

  @Input()
  leftAlign?: boolean;

  @Input()
  disabled?: boolean = false;

  @Input()
  emitButtonEvents?: boolean = false;

  @Input()
  ariaLabel = 'Date time';

  displayValue: string;
  outputValue: string;
  selectedBuffer: string;
  selectedValue: string;

  protected readonly DisplayType = DisplayType;
  protected readonly DateHeaderComponent = DateHeaderComponent;

  @Output()
  onDataPicked = new EventEmitter<{ control?: string; data: string }>();

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime | string }>();

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

  /**
   * Formats a date string to 'DD/MM/YYYY'.
   * @param {string} date - The date string to format.
   * @returns {string} - The formatted date string.
   */
  formatDisplayDate(date: string) {
    return DateTime.at(date).format('DD/MM/YYYY');
  }

  /**
   * Formats a time string to 'HH:mm'.
   * @param {string} time - The time string to format.
   * @returns {string} - The formatted time string.
   */
  formatDisplayTime(time: string) {
    return DateTime.at(time).format('HH:mm');
  }

  /**
   * Handles the change of the selected date.
   * @param {any} event - The event containing the new selected date.
   */
  onSelectedChange(event) {
    this.selectedBuffer = event;
    console.log(this.selectedBuffer);
  }

  /**
   * Handles the selection of a date or time.
   * @param {string} event - The selected date or time in string format.
   * @param {DisplayType} control - The type of display (date or time).
   */
  onSelected(event: string, control: DisplayType) {
    let output: string;
    this.selectedValue = this.selectedBuffer ? this.selectedBuffer : event;

    const val = this.selectedValue as string;

    switch (control) {
      case DisplayType.Date:
        this.displayValue = this.formatDisplayDate(val);
        output = DateTime.at(val).format('YYYY-MM-DD');
        break;
      case DisplayType.Time:
        this.displayValue = this.formatDisplayTime(val);
        this.outputValue = DateTime.at(val).format('YYYY-MM-DDTHH:mm');
        output = this.outputValue;
        break;
      default:
        this.displayValue = '';
        output = '';
        break;
    }
    this.onDataPicked.emit({
      control: this.control,
      data: output,
    });
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
}
