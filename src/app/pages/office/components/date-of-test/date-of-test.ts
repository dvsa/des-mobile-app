import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import {
  isValidStartDate,
  // PRESS_TIME_TO_ENABLE_EDIT,
} from '@shared/helpers/test-start-time';

@Component({
  selector: 'date-of-test',
  templateUrl: 'date-of-test.html',
  styleUrls: ['date-of-test.scss'],
})
export class DateOfTest implements OnInit {

  @Input()
  dateOfTest: string;

  @Output()
  dateOfTestChange = new EventEmitter<string>();

  @Output()
  setIsValidStartDateTime = new EventEmitter<boolean>();

  @ViewChild('editDateInput') inputEl: ElementRef;

  isPressed: boolean = false;
  timeoutId: NodeJS.Timeout;
  editMode: boolean = false;
  isInvalid: boolean = false;

  customTestDate: string = '';
  maxDate: string;
  minDate: string;

  ngOnInit() {
    this.customTestDate = moment(this.dateOfTest, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.maxDate = moment().format('YYYY-MM-DD');
    this.minDate = moment().subtract(1, 'years').format('YYYY-MM-DD');
  }

  datePickerChange() {
    const currentDate = moment().format('YYYY-MM-DD');

    if (!isValidStartDate(this.customTestDate, currentDate)) {
      this.isInvalid = true;
      this.setIsValidStartDateTime.emit(false);
      return;
    }

    this.isInvalid = false;

    const formattedCustomTestDate = moment(this.customTestDate).format('YYYY-MM-DD');
    const formattedDateOfTest = moment(this.dateOfTest, 'DD/MM/YYYY').format('YYYY-MM-DD');

    if (formattedCustomTestDate === currentDate || formattedDateOfTest === formattedCustomTestDate) {
      return;
    }

    this.setIsValidStartDateTime.emit(true);
    this.dateOfTestChange.emit(formattedCustomTestDate);
    this.disableEdit();
  }

  datePickerCancel() {
    this.disableEdit();
  }

  onTouchStart() {
    this.isPressed = true;

    setTimeout(() => {
      if (this.isPressed) {
        this.editMode = true;
      }
    }, 3000);
    // @TODO: Substitute 3000 for the 10000 default;
    //  }, PRESS_TIME_TO_ENABLE_EDIT);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  enableEdit = () => this.editMode = true;

  disableEdit = () => this.editMode = false;

}
