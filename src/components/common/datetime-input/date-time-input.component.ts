import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { MatCalendar } from '@angular/material/datepicker';
import { DateHeaderComponent } from '@components/common/datetime-input/date-header/date-header.component';

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
  ariaLabel: string = 'Date time';

  displayValue: string;
  outputValue: string;
  selectedBuffer: string;
  selectedValue: string;

  protected readonly DisplayType = DisplayType;
  protected readonly DateHeaderComponent = DateHeaderComponent;


  @Output()
  onDataPicked = new EventEmitter<{ control?: string, data: string }>();

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string, data: IonDatetime | string }>();

  handleMonthSelected(event: string, minDate: string) {
    let selected = DateTime.at(this.selectedBuffer ? this.selectedBuffer : '');
    let current = DateTime.at(event)
    let minimum = DateTime.at(minDate)

    if (!(current.month() === selected.month() &&
      current.year() === selected.year())) {
      if (current.format('YYYY-MM-DD') <
        minimum.format('YYYY-MM-DD')) {
        this.selectedBuffer = minDate;
      } else {
        this.selectedBuffer = event;
      }
    }
  }

  handleBackButton(): 'month' {
    if (this.selectedValue) {
      this.datePicker.activeDate = this.selectedValue
    } else {
      this.datePicker.activeDate = this.selectedBuffer ? this.selectedBuffer : this.datePicker.maxDate;
    }
    return 'month'
  }

  formatDisplayDate(date: string) {
    return DateTime.at(date)
      .format('DD/MM/YYYY');
  }

  formatDisplayTime(time: string) {
    return DateTime.at(time)
      .format('HH:mm');
  }

  onSelected(event: string, control: DisplayType) {
    let output: string;
    this.selectedValue = this.selectedBuffer ? this.selectedBuffer : this.selectedValue;

    const val = this.selectedValue as string;

    switch (control) {
      case DisplayType.Date:
        this.displayValue = this.formatDisplayDate(val);
        output = DateTime
          .at(val)
          .format('YYYY-MM-DD');
        break;
      case DisplayType.Time:
        this.displayValue = this.formatDisplayTime(val);

        this.outputValue = DateTime
          .at(val)
          .format('YYYY-MM-DDTHH:mm');
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
