import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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

  @Output()
  onDataPicked = new EventEmitter<{ control?: string, data: string }>();

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string, data: IonDatetime | string }>();

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
    this.selectedValue = this.selectedBuffer;

    const val = event as string;

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
    this.selectedBuffer = null;
    this.customButtonEvent.emit({
      buttonType,
      data: dateTime,
    });
  }

}
