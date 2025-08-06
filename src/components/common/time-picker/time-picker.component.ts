import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
export class TimePickerComponent implements OnInit, OnChanges {
  readonly TimeUnits = TimeUnits;
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
    if (changes?.initialValue) {
      this.interpretTime(changes.initialValue.currentValue);
    } else if (changes?.minTime || changes?.maxTime) {
      this.inputChanged();
    }
  }

  /**
   * Interprets the provided time value and sets the selected hour and minute.
   * @param value - The time value in string format (e.g., 'YYYY-MM-DDTHH:mm').
   */
  interpretTime(value: string) {
    const date = new Date(value);
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
  }

  /**
   * Pads a number with a leading zero if it is less than 10.
   * @param value - The number to pad.
   * @returns A string representation of the number, padded with a leading zero if necessary.
   */
  padWithZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  /**
   * Takes in a value and sets the relevant variables to that value based on the passed time unit.
   * @param timeUnit - The time unit to update (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @param newNumber - The new number to set for the selected time unit.
   */
  addRelevantTimeUnit(timeUnit: TimeUnits, newNumber: number) {
    const newNumString = this.padWithZero(newNumber);
    // Update either selected hour or minute based on the time unit
    switch (timeUnit) {
      case TimeUnits.HOUR:
        this.selectedHour = newNumString;
        this.hourInputBox.value = newNumString;
        break;
      case TimeUnits.MINUTE:
        this.selectedMinute = newNumString;
        this.minuteInputBox.value = newNumString;
        break;
    }
  }

  /**
   * Handles manual input for the hour or minute fields.
   * Validates the input and updates the relevant time unit.
   * @param timeUnit - The time unit being updated (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @param newInput - The new input value entered by the user.
   */
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

  /**
   * Iterates the selected time unit (hour or minute) by a specified increment.
   * Wraps around if the increment exceeds the maximum or minimum values.
   * @param timeUnit - The time unit to iterate (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @param increment - The amount to increment or decrement the time unit.
   * @param minimum - The minimum value for the time unit.
   * @param maximum - The maximum value for the time unit.
   */
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

  /**
   * Gets the current date with the selected hour and minute.
   * This is used to create a Date object that represents the selected time so we can use it for comparisons.
   * @returns A Date object with the current date and the selected hour and minute.
   */
  getDateWithSelectedTime() {
    // Create a new date object with the current date and the selected hour and minute
    const date = new Date();
    date.setHours(Number.parseInt(this.selectedHour));
    date.setMinutes(Number.parseInt(this.selectedMinute));
    // Set seconds to 0 to avoid any time discrepancies
    date.setSeconds(0);
    return date;
  }

  /**
   * Sets the time based variables to the provided value.
   * This method updates the selected hour and minute based on the given value.
   * @param value - The time value in string format (e.g., 'YYYY-MM-DDTHH:mm').
   */
  setTime(value: string) {
    const date = new Date(value);
    // Update the selected hour and minute based on the provided value
    this.selectedHour = this.padWithZero(date.getHours());
    this.selectedMinute = this.padWithZero(date.getMinutes());
    // Update the input boxes with the new values
    this.hourInputBox.value = this.selectedHour;
    this.minuteInputBox.value = this.selectedMinute;
  }

  /**
   * Handles changes in the input fields for hour and minute.
   * Validates the selected time against the minimum and maximum time constraints.
   * Emits the formatted time change event.
   */
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

  /**
   * Checks if the up arrow should be shown for the given time unit.
   * This is determined by whether the new date after incrementing is before or matches the maximum date.
   * @param timeUnit - The time unit to check (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @returns A boolean indicating whether the up arrow should be shown.
   */
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

  /**
   * Checks if the down arrow should be shown for the given time unit.
   * This is determined by whether the new date after decrementing is after or matches the minimum date.
   * @param timeUnit - The time unit to check (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @returns A boolean indicating whether the down arrow should be shown.
   */
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

  /**
   * Handles the input event for the hour input box.
   * If the input length is 2 or more, it focuses on the minute input box.
   * @param $event - The custom event triggered by the hour input box.
   */
  async hourBoxInputted($event: CustomEvent) {
    // Check if the input length is 2 or more to trigger focus on the minute input box
    if ($event?.detail.value?.length >= 2) {
      await this.focusMinuteInput(true, false);
    }
  }

  /**
   * Sets focus on the specified input box and optionally erases its value.
   * If shouldStartAtEnd is true, it sets the cursor position to the end of the input.
   * @param inputField - The input field to focus on.
   * @param shouldErase - Whether to erase the input value.
   * @param shouldStartAtEnd - Whether to start the cursor at the end of the input.
   */
  async setFocusOnInputBox(inputField: IonInput, shouldErase: boolean, shouldStartAtEnd = false) {
    // Set focus on the specified input box and optionally erase its value
    await inputField.setFocus();
    if (shouldErase) {
      inputField.value = '';
    } else {
      // Run a timeout to ensure the input element is ready before setting the cursor position (the time is set to 0 to run immediately, but if not placed within a timeout, it may not work as expected)
      setTimeout(async () => this.manuallySetSelection(await inputField.getInputElement(), shouldStartAtEnd), 0);
    }
  }

  manuallySetSelection(inputElement: HTMLInputElement, shouldStartAtEnd: boolean) {
    // If not erasing, set the cursor position to the end or start based on shouldStartAtEnd
    const selectionPosition = shouldStartAtEnd ? inputElement.value.length : 0;
    inputElement.setSelectionRange(selectionPosition, selectionPosition);
  }

  /**
   * Sets focus on the hour input box and optionally erases its value.
   * If shouldStartAtEnd is true, it sets the cursor position to the end of the input.
   * @param shouldErase - Whether to erase the input value.
   * @param shouldStartAtEnd - Whether to start the cursor at the end of the input.
   */
  async focusHourInput(shouldErase: boolean, shouldStartAtEnd = false) {
    // Set focus on the hour input box and optionally erase its value
    await this.setFocusOnInputBox(this.hourInputBox, shouldErase, shouldStartAtEnd);
  }

  /**
   * Sets focus on the minute input box and optionally erases its value.
   * If shouldStartAtEnd is true, it sets the cursor position to the end of the input.
   * @param shouldErase - Whether to erase the input value.
   * @param shouldStartAtEnd - Whether to start the cursor at the end of the input.
   */
  async focusMinuteInput(shouldErase: boolean, shouldStartAtEnd = false) {
    // Set focus on the minute input box and optionally erase its value
    await this.setFocusOnInputBox(this.minuteInputBox, shouldErase, shouldStartAtEnd);
  }

  /**
   * Handles the input event for the minute input box.
   * If the input length is 2 or more, it emits an event to indicate that the minute box is complete.
   * @param $event - The custom event triggered by the minute input box.
   */
  minuteBoxInputted($event: CustomEvent) {
    // Check if the input length is 2 or more to emit the minuteBoxExitedForward event
    if ($event?.detail.value?.length >= 2) {
      this.minuteBoxExitedForward.emit(true);
    }
  }

  /**
   * Saves the current focus position in the input field.
   * This is used to for comparison purposes.
   * @param inputField - The input field where the focus position is saved.
   */
  async saveCurrentFocusPosition(inputField: IonInput) {
    // Save the current cursor position in the input field
    this.savedFocusPosition = (await inputField.getInputElement()).selectionStart;
  }

  /**
   * Handles the tab key press event to switch focus between hour and minute inputs.
   * If the hour input is focused, it moves focus to the minute input.
   * If the minute input is focused, it emits an event to indicate it has exited.
   * @param timeUnit - The time unit being focused (either TimeUnits.HOUR or TimeUnits.MINUTE).
   */
  async tabPressed(timeUnit: TimeUnits) {
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

  /**
   * Handles horizontal arrow key presses (left and right) in the input fields.
   * If the left arrow is pressed at the start of the hour input, it emits an event to indicate exit.
   * If the right arrow is pressed at the end of the minute input, it focuses on the hour input.
   * @param keyPressed - The key that was pressed (either KeyCodes.LEFT or KeyCodes.RIGHT).
   * @param timeUnit - The time unit being focused (either TimeUnits.HOUR or TimeUnits.MINUTE).
   * @param inputField - The input field where the key press occurred.
   */
  async horizontalArrowPressed(keyPressed: string, timeUnit: TimeUnits, inputField: IonInput) {
    const inputEl = await inputField.getInputElement();
    const pos = inputEl.selectionStart;

    // Check if focus is at the start of the input and the saved focus position matches (meaning it was a result of pressing left while already at the start)
    if (keyPressed === KeyCodes.LEFT && pos === 0 && this.savedFocusPosition === pos) {
      // If the hour input is focused and the left arrow is pressed at the start, emit an event to indicate exit
      if (timeUnit === TimeUnits.HOUR) {
        this.hourBoxExitedBack.emit(false);
      } else {
        // If the minute input is focused, focus on the hour input
        await this.focusHourInput(false, true);
      }
      return;
    }

    // Check if focus is at the end of the input and the saved focus position matches (meaning it was a result of pressing left while already at the end)
    if (keyPressed === KeyCodes.RIGHT && pos === inputEl.value.length && this.savedFocusPosition === pos) {
      if (timeUnit === TimeUnits.HOUR) {
        // If the hour input is focused and the right arrow is pressed at the end, focus on the minute input
        await this.focusMinuteInput(false);
      } else {
        // If the minute input is focused and the right arrow is pressed at the end, emit an event to indicate exit
        this.minuteBoxExitedForward.emit(false);
      }
      return;
    }
  }

  /**
   * Handles vertical arrow key presses (up and down) in the input fields.
   * If the up arrow is pressed, it increments the time unit; if the down arrow is pressed, it decrements it.
   * @param keyPressed - The key that was pressed (either KeyCodes.UP or KeyCodes.DOWN).
   * @param timeUnit - The time unit being focused (either TimeUnits.HOUR or TimeUnits.MINUTE).
   */
  verticalArrowPressed(keyPressed: string, timeUnit: TimeUnits) {
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

  protected readonly KeyCodes = KeyCodes;
}
