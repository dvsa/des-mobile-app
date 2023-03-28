import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import moment from 'moment';

export enum DisplayType {
  Date = 'date',
  Time = 'time',
}

@Component({
  selector: 'datetime-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
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
  disabled?: boolean = false;

  @Input()
  emitButtonEvents?: boolean = false;

  displayValue: string;
  outputValue: string;

  @Output()
  onDataPicked = new EventEmitter<{ control?: string, data: string }>();

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string, data: IonDatetime }>();

  formatDisplayDate(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  formatDisplayTime(time: string) {
    return moment(time).format('HH:mm');
  }

  onSelected(event: IonDatetime, control: DisplayType) {
    let output: string;
    switch (control) {
      case DisplayType.Date:
        this.displayValue = this.formatDisplayDate(event.value as string);
        output = moment(event.value).format('YYYY-MM-DD');
        break;
      case DisplayType.Time:
        this.displayValue = this.formatDisplayTime(event.value as string);
        this.outputValue = moment(event.value).format('YYYY-MM-DDTHH:mm');
        output = moment(event.value).format('YYYY-MM-DDTHH:mm');
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
