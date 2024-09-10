import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateTime } from '@shared/helpers/date-time';
import { IonInput } from '@ionic/angular';

enum TimeUnits {
  MINUTE = 'minute',
  HOUR = 'hour',
}

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent {
  protected readonly TimeUnits = TimeUnits;
  private readonly timeFormat = 'HH:mm';

  @ViewChild('minuteInput') minuteInputBox!: IonInput;

  @Output()
  oneTimeChanged = new EventEmitter<string>();

  @Input()
  initialValue = DateTime.at(new Date()).format('YYYY-MM-DDT00:00');

  @Input()
  minTime: string;

  @Input()
  maxTime: string;

  minimumMinute = 0;
  maximumMinute = 59;
  minimumHour = 0;
  maximumHour = 23;

  selectedHour = '00';
  selectedMinute = '00';

  ngOnInit() {
    this.interpretTime(this.initialValue);
  }

  ngOnChanges(changes: any) {
    if (changes.initialValue) {
      this.interpretTime(changes.initialValue.currentValue);
    } else if (changes.minTime || changes.maxTime) {
      this.inputChanged();
    }
  }

  interpretTime(value: string) {
    const date = new Date(value);
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
  }

  padWithZero(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }

  addRelevantTimeUnit(timeUnit: TimeUnits, newNumber: number) {
    const newNumString = this.padWithZero(newNumber);
    if (timeUnit === TimeUnits.HOUR) {
      this.selectedHour = newNumString;
    } else {
      this.selectedMinute = newNumString;
    }
  }

  inputEnteredManually(timeUnit: TimeUnits, newInput: string) {
    if (timeUnit === TimeUnits.HOUR) {
      this.selectedHour = newInput.length === 0 ? this.minimumHour.toString() : newInput;
      this.iterateNumbers(timeUnit, 0, this.minimumHour, this.maximumHour);
    } else {
      this.selectedMinute = newInput.length === 0 ? this.minimumMinute.toString() : newInput;
      this.iterateNumbers(timeUnit, 0, this.minimumMinute, this.maximumMinute);
    }
  }

  iterateNumbers(timeUnit: TimeUnits, increment: number, minimum: number, maximum: number) {
    const currentNumber = Number.parseInt(timeUnit == TimeUnits.HOUR ? this.selectedHour : this.selectedMinute);
    const iteratedNumber = currentNumber + increment;
    let numberToSet = iteratedNumber;

    if (iteratedNumber < minimum) {
      numberToSet = maximum;
    } else if (iteratedNumber > maximum) {
      numberToSet = minimum;
    }
    this.addRelevantTimeUnit(timeUnit, numberToSet);
    this.inputChanged();
  }

  getDateWithSelectedTime() {
    const date = new Date();
    date.setHours(Number.parseInt(this.selectedHour));
    date.setMinutes(Number.parseInt(this.selectedMinute));
    date.setSeconds(0);
    return date;
  }

  setTime(value: string) {
    const date = new Date(value);
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
  }

  inputChanged() {
    let timeChanged: Date | string = this.getDateWithSelectedTime();

    if (this.minTime && timeChanged < new Date(this.minTime)) {
      this.setTime(this.minTime);
      timeChanged = this.minTime;
    } else if (this.maxTime && timeChanged > new Date(this.maxTime)) {
      this.setTime(this.maxTime);
      timeChanged = this.maxTime;
    }

    this.oneTimeChanged.emit(DateTime.at(timeChanged).format('YYYY-MM-DDTHH:mm'));
  }

  shouldShowUpArrow(timeUnit: TimeUnits) {
    if (!this.maxTime) {
      return true;
    }

    const maxDate = new Date(this.maxTime);
    const newDate = DateTime.at(this.getDateWithSelectedTime()).add(1, timeUnit);

    return newDate.isBefore(maxDate) || newDate.format(this.timeFormat) === DateTime.at(maxDate).format(this.timeFormat);
  }

  shouldShowDownArrow(timeUnit: TimeUnits) {
    if (!this.minTime) {
      return true;
    }

    const minDate = new Date(this.minTime);
    const newDate = DateTime.at(this.getDateWithSelectedTime()).subtract(1, timeUnit);

    return newDate.isAfter(minDate) || newDate.format(this.timeFormat) === DateTime.at(minDate).format(this.timeFormat);
  }

  hourBoxInputted($event: CustomEvent) {
    if ($event?.detail.value?.length >= 2) {
      this.minuteInputBox.setFocus().then(() => {
        this.minuteInputBox.value = '';
      });
    }
  }
}
