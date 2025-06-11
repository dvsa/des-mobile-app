import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

enum TimeUnits {
  MINUTE = 'minute',
  HOUR = 'hour',
}

enum KeyCodes {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
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
  @ViewChild('hourInput') hourInputBox!: IonInput;

  @Output()
  onTimeChanged = new EventEmitter<string>();

  @Output()
  minuteBoxExitedForward = new EventEmitter<void>();

  @Output()
  hourBoxExitedBack = new EventEmitter<void>();

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

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.interpretTime(this.initialValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.initialValue) {
        this.interpretTime(changes.initialValue.currentValue);
      } else if (changes.minTime || changes.maxTime) {
        this.inputChanged();
      }
    }
  }

  interpretTime(value: string) {
    const date = new Date(value);
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
  }

  padWithZero(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }

  addRelevantTimeUnit(timeUnit: TimeUnits, newNumber: number) {
    const newNumString = this.padWithZero(newNumber);
    if (timeUnit === TimeUnits.HOUR) {
      this.selectedHour = newNumString;
      this.hourInputBox.value = newNumString;
    } else {
      this.selectedMinute = newNumString;
      this.minuteInputBox.value = newNumString;
    }
  }

  inputEnteredManually(timeUnit: TimeUnits, newInput: string) {
    if (timeUnit === TimeUnits.HOUR) {
      console.log('inputEnteredManually', timeUnit, newInput);
      this.selectedHour = newInput.length === 0 ? this.minimumHour.toString() : newInput;
      this.iterateNumbers(timeUnit, 0, this.minimumHour, this.maximumHour);
    } else {
      this.selectedMinute = newInput.length === 0 ? this.minimumMinute.toString() : newInput;
      this.iterateNumbers(timeUnit, 0, this.minimumMinute, this.maximumMinute);
    }
  }

  iterateNumbers(timeUnit: TimeUnits, increment: number, minimum: number, maximum: number) {
    // Determine the current number based on the time unit
    const currentNumber = Number.parseInt(timeUnit === TimeUnits.HOUR ? this.selectedHour : this.selectedMinute);
    // Calculate the new number by adding the increment
    const iteratedNumber = currentNumber + increment;
    // Ensure the new number wraps around if it exceeds the maximum or minimum
    let numberToSet = iteratedNumber;

    if (iteratedNumber < minimum) {
      numberToSet = maximum;
    } else if (iteratedNumber > maximum) {
      numberToSet = minimum;
    }

    // Set the new number in the appropriate field
    this.addRelevantTimeUnit(timeUnit, numberToSet);
    // Emit the time change event
    this.inputChanged();
  }

  getDateWithSelectedTime() {
    // Create a new date object with the current date and the selected hour and minute
    const date = new Date();
    date.setHours(Number.parseInt(this.selectedHour));
    date.setMinutes(Number.parseInt(this.selectedMinute));
    // Set seconds to 0 to avoid any time discrepancies
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

    this.onTimeChanged.emit(DateTime.at(timeChanged).format('YYYY-MM-DDTHH:mm'));
    this.changeDetectorRef.detectChanges();
  }

  shouldShowUpArrow(timeUnit: TimeUnits) {
    if (!this.maxTime) {
      return true;
    }

    const maxDate = new Date(this.maxTime);
    const newDate = DateTime.at(this.getDateWithSelectedTime()).add(1, timeUnit);

    return (
      newDate.isBefore(maxDate) || newDate.format(this.timeFormat) === DateTime.at(maxDate).format(this.timeFormat)
    );
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
    // Check if the input length is 2 or more to trigger focus on the minute input box
    if ($event?.detail.value?.length >= 2) {
      this.focusMinuteInput(true);
    }
  }

  focusHourInput(shouldErase: boolean) {
    // Set focus on the hour input box and optionally erase its value
    this.hourInputBox.setFocus().then(() => {
      if (shouldErase) {
        this.hourInputBox.value = '';
      }
    });
  }

  focusMinuteInput(shouldErase: boolean) {
    // Set focus on the minute input box and optionally erase its value
    this.minuteInputBox.setFocus().then(() => {
      if (shouldErase) {
        this.minuteInputBox.value = '';
      }
    });
  }

  minuteBoxInputted($event: CustomEvent) {
    // Check if the input length is 2 or more to emit the minuteBoxExitedForward event
    if ($event?.detail.value?.length >= 2) {
      this.minuteBoxExitedForward.emit();
    }
  }

  async handleKeyPress(event: KeyboardEvent, timeUnit: TimeUnits, inputField: IonInput) {
    // Prevent default behavior for left and right arrow keys
    event.preventDefault();
    const keyPressed = event.key;
    if (keyPressed === KeyCodes.UP || keyPressed === KeyCodes.DOWN) {
      // Check if we can show the up or down arrow based on the time unit
      if (
        (keyPressed === KeyCodes.UP && this.shouldShowUpArrow(timeUnit)) ||
        (keyPressed === KeyCodes.DOWN && this.shouldShowDownArrow(timeUnit))
      ) {
        // Determine the increment based on the key pressed
        const increment = keyPressed === KeyCodes.UP ? 1 : -1;
        const minimum = timeUnit === TimeUnits.HOUR ? this.minimumHour : this.minimumMinute;
        const maximum = timeUnit === TimeUnits.HOUR ? this.maximumHour : this.maximumMinute;
        // Call the iterateNumbers method with the determined time unit and increment
        this.iterateNumbers(timeUnit, increment, minimum, maximum);
      }
    }
  }
}
