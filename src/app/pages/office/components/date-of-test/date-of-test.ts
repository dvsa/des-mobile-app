import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';
import { IonDatetime } from '@ionic/angular';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { PRESS_TIME_TO_ENABLE_EDIT, isValidStartDate } from '@shared/helpers/test-start-time';

@Component({
  selector: 'date-of-test',
  templateUrl: 'date-of-test.html',
  styleUrls: ['date-of-test.scss'],
  standalone: false,
})
export class DateOfTest implements OnInit {
  @Input()
  dateOfTest: string;

  @Output()
  dateOfTestChange = new EventEmitter<string>();

  @Output()
  setIsValidStartDateTime = new EventEmitter<boolean>();

  @ViewChild('editDateInput') inputEl: ElementRef;

  isPressed = false;
  editMode = false;
  isInvalid = false;

  customTestDate = '';
  maxDate: string;
  minDate: string;
  protected readonly DisplayType = DisplayType;

  ngOnInit() {
    this.customTestDate = new DateTime(this.dateOfTest).format('yyyy-MM-dd');
    this.maxDate = new DateTime().format('yyyy-MM-dd');
    this.minDate = new DateTime().subtract(1, Duration.YEAR).format('yyyy-MM-dd');
  }

  handleCancel(dateTime: IonDatetime): Promise<void> {
    return dateTime.cancel(true).then(() => {
      this.disableEdit();
    });
  }

  getIsValidStartDate(inputDate: string, currentDate: string): boolean {
    return isValidStartDate(inputDate, currentDate);
  }

  handleDone(dateTime: IonDatetime): Promise<void> {
    return dateTime
      .confirm(false)
      .then(() => {
        // if date not set, then close the modal on done click as fail-safe before handling the data;
        if (!dateTime.value) {
          return dateTime.confirm(true);
        }

        const currentDate: string = new DateTime().format('yyyy-MM-dd');
        const selectedDate: string = DateTime.at(dateTime.value as string).format('yyyy-MM-dd');

        if (!this.getIsValidStartDate(selectedDate, currentDate)) {
          this.isInvalid = true;
          this.setIsValidStartDateTime.emit(false);
          return;
        }

        this.isInvalid = false;
        this.customTestDate = dateTime.value as string;
        this.setIsValidStartDateTime.emit(true);
        this.dateOfTestChange.emit(this.customTestDate);
        this.disableEdit();
      })
      .finally(() => dateTime.confirm(true));
  }

  onTouchStart() {
    this.isPressed = true;

    setTimeout(() => {
      if (this.isPressed) {
        this.editMode = true;
      }
    }, PRESS_TIME_TO_ENABLE_EDIT);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  disableEdit = () => (this.editMode = false);

  handleEvents(dateTime: IonDatetime, buttonType: string): Promise<void> {
    switch (buttonType) {
      case 'clear':
        return dateTime.reset();
      case 'done':
        return dateTime.confirm().then(() => {
          this.handleDone(dateTime).then(null);
        });
      case 'cancel':
        return dateTime.cancel().then(() => {
          this.handleCancel(dateTime).then(null);
        });
      default:
        break;
    }
  }
}
