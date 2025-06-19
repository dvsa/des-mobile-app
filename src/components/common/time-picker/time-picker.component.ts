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
  TAB = 'Tab',
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
  minuteBoxExitedForward = new EventEmitter<boolean>();

  @Output()
  tabPressedInMinuteBox = new EventEmitter<boolean>();

  @Output()
  hourBoxExitedBack = new EventEmitter<boolean>();

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

  savedFocusPosition = -1;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    // Initialize the time picker with the initial value
    this.interpretTime(this.initialValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes to the initial value, minTime, or maxTime
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
      // Validate the hour input and set it to the minimum if empty
      this.selectedHour = newInput.length === 0 ? this.minimumHour.toString() : newInput;
      // Ensure the hour input is within the valid range
      this.iterateNumbers(timeUnit, 0, this.minimumHour, this.maximumHour);
    } else {
      // Validate the minute input and set it to the minimum if empty
      this.selectedMinute = newInput.length === 0 ? this.minimumMinute.toString() : newInput;
      // Ensure the minute input is within the valid range
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
    // Update the selected hour and minute based on the provided value
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
    // Update the input boxes with the new values
    this.hourInputBox.value = this.selectedHour;
    this.minuteInputBox.value = this.selectedMinute;
  }

  inputChanged() {
    // Get the date with the selected time
    let timeChanged: Date | string = this.getDateWithSelectedTime();
    // If the selected hour or minute is less than the minimum, set it to the minimum value
    if (this.minTime && timeChanged < new Date(this.minTime)) {
      this.setTime(this.minTime);
      timeChanged = this.minTime;
    }
    // If the selected hour or minute is greater than the maximum, set it to the maximum value
    else if (this.maxTime && timeChanged > new Date(this.maxTime)) {
      this.setTime(this.maxTime);
      timeChanged = this.maxTime;
    }

    // Emit the time change event with the formatted date
    this.onTimeChanged.emit(DateTime.at(timeChanged).format('YYYY-MM-DDTHH:mm'));
    // Trigger change detection to update the view
    this.changeDetectorRef.detectChanges();
  }

  shouldShowUpArrow(timeUnit: TimeUnits) {
    // Check if the maximum time is set
    if (!this.maxTime) {
      return true;
    }
    // Get the maximum date from the maxTime input
    const maxDate = new Date(this.maxTime);
    // Calculate the new date by adding one time unit to the current selected time
    const newDate = DateTime.at(this.getDateWithSelectedTime()).add(1, timeUnit);
    // Check if the new date is before the maximum date or if it matches the maximum date
    return (
      newDate.isBefore(maxDate) || newDate.format(this.timeFormat) === DateTime.at(maxDate).format(this.timeFormat)
    );
  }

  shouldShowDownArrow(timeUnit: TimeUnits) {
    // Check if the minimum time is set
    if (!this.minTime) {
      return true;
    }
    // Get the minimum date from the minTime input
    const minDate = new Date(this.minTime);
    // Calculate the new date by subtracting one time unit from the current selected time
    const newDate = DateTime.at(this.getDateWithSelectedTime()).subtract(1, timeUnit);
    // Check if the new date is after the minimum date or if it matches the minimum date
    return newDate.isAfter(minDate) || newDate.format(this.timeFormat) === DateTime.at(minDate).format(this.timeFormat);
  }

  async hourBoxInputted($event: CustomEvent) {
    // Check if the input length is 2 or more to trigger focus on the minute input box
    if ($event?.detail.value?.length >= 2) {
      await this.focusMinuteInput(true, false);
    }
  }

  async focusHourInput(shouldErase: boolean, shouldStartAtEnd = false) {
    // Set focus on the hour input box and optionally erase its value
    this.hourInputBox.setFocus().then(async () => {
      if (shouldErase) {
        this.hourInputBox.value = '';
      } else {
        const selectionPosition = shouldStartAtEnd ? (await this.minuteInputBox.getInputElement()).value.length : 0;
        // If not erasing, set the selection range to the start of the input
        (await this.hourInputBox.getInputElement()).setSelectionRange(selectionPosition, selectionPosition);
      }
    });
  }

  async focusMinuteInput(shouldErase: boolean, shouldStartAtEnd = false) {
    // Set focus on the minute input box and optionally erase its value
    this.minuteInputBox.setFocus().then(async () => {
      if (shouldErase) {
        this.minuteInputBox.value = '';
      } else {
        const selectionPosition = shouldStartAtEnd ? (await this.minuteInputBox.getInputElement()).value.length : 0;
        // If not erasing, set the selection range to the start of the input
        (await this.minuteInputBox.getInputElement()).setSelectionRange(selectionPosition, selectionPosition);
      }
    });
  }

  minuteBoxInputted($event: CustomEvent) {
    // Check if the input length is 2 or more to emit the minuteBoxExitedForward event
    if ($event?.detail.value?.length >= 2) {
      this.minuteBoxExitedForward.emit(true);
    }
  }

  async saveCurrentFocusPosition(inputField: IonInput) {
    // Save the current cursor position in the input field
    this.savedFocusPosition = (await inputField.getInputElement()).selectionStart;
  }

  async handleKeyPress(event: KeyboardEvent, timeUnit: TimeUnits, inputField: IonInput) {
    const keyPressed = event.key;
    if (keyPressed === KeyCodes.TAB) {
      // Handle tab key to switch focus between hour and minute inputs
      if (timeUnit === TimeUnits.HOUR) {
        // If the hour input is focused, move focus to the minute input
        await this.focusMinuteInput(false);
      } else {
        // If the minute input is focused, emit an event to indicate it has exited forward
        this.tabPressedInMinuteBox.emit();
      }
      return;
    }
    if (keyPressed === KeyCodes.LEFT || keyPressed === KeyCodes.RIGHT) {
      // If the left arrow is pressed while the input field is focused on the beginning of the input...
      const currentFocusPosition = (await inputField.getInputElement()).selectionStart;
      if (keyPressed === KeyCodes.LEFT) {
        // If the left arrow is pressed while the input field is focused on the beginning of the input and we didn't just move there...
        if (currentFocusPosition === 0 && this.savedFocusPosition === currentFocusPosition) {
          switch (timeUnit) {
            case TimeUnits.HOUR:
              // If the hour input is focused and the left arrow is pressed at the start, focus the minute input
              this.hourBoxExitedBack.emit(false);
              break;
            case TimeUnits.MINUTE:
              // If the minute input is focused and the left arrow is pressed at the start, focus the hour input
              await this.focusHourInput(false, true);
              break;
          }
        }
        return;
      }
      if (keyPressed === KeyCodes.RIGHT) {
        // If the right arrow is pressed while the input field is focused on the end of the input and we didn't just move there...
        if (
          currentFocusPosition === (await inputField.getInputElement()).value.length &&
          this.savedFocusPosition === currentFocusPosition
        ) {
          switch (timeUnit) {
            case TimeUnits.HOUR:
              // If the hour input is focused and the right arrow is pressed at the end, focus the minute input
              await this.focusMinuteInput(false);
              break;
            case TimeUnits.MINUTE:
              // If the minute input is focused and the right arrow is pressed at the end, emit an event to indicate it has exited forward
              this.minuteBoxExitedForward.emit(false);
              break;
          }
        }
        return;
      }
    }
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
        return;
      }
    }
  }
}
