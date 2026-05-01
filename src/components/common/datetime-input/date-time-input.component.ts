import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  standalone: false,
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
  ariaLabel = 'Date time';

  displayValue: string;
  outputValue: string;

  @Output()
  onDataPicked = new EventEmitter<{ control?: string; data: string }>();

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime }>();

  formatDisplayDate(date: string) {
    return DateTime.at(date, 'UK').format('dd/MM/yyyy');
  }

  formatDisplayTime(time: string) {
    return DateTime.at(time, 'UK').format('HH:mm');
  }

  onSelected(event: IonDatetime, control: DisplayType) {
    let output: string;

    const val = event.value as string;

    switch (control) {
      case DisplayType.Date:
        this.displayValue = this.formatDisplayDate(val);

        output = DateTime.at(val).format('yyyy-MM-dd');
        break;
      case DisplayType.Time:
        this.displayValue = this.formatDisplayTime(val);

        this.outputValue = DateTime.at(val, 'UK').format("yyyy-MM-dd'T'HH:mm");

        output = DateTime.at(val, 'UK').format("yyyy-MM-dd'T'HH:mm");
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

  buttonEmit(dateTime: IonDatetime, buttonType: string) {
    this.customButtonEvent.emit({
      buttonType,
      data: dateTime,
    });
  }
}
