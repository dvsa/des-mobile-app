import {NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DateAdapter, NativeDateAdapter} from '@angular/material/core';
import {MatCalendar, MatCalendarCellClassFunction, MatCalendarCellCssClasses} from '@angular/material/datepicker';
import {DateHeaderComponent} from '@components/common/datetime-input/date-header/date-header.component';
import {IonDatetime, IonicModule} from '@ionic/angular';
import {DateTime} from '@shared/helpers/date-time';

export class CustomDateAdapter extends NativeDateAdapter {
  //Set first day of the week to Monday
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@Component({
  selector: 'custom-calendar-component',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  imports: [MatCalendar, IonicModule, NgIf],
  providers: [{provide: DateAdapter, useClass: CustomDateAdapter}],

  standalone: true,
})
export class CustomCalendarComponent {
  @ViewChild(MatCalendar) datePicker!: MatCalendar<string>;

  @Input()
  shouldDisplayRange = false;

  @Input()
  otherDateInRange: string;

  @Input()
  customTitle: string;

  @Input()
  maxValue: string;

  @Input()
  minValue: string;

  @Input()
  selectedBuffer: string;

  @Input()
  selectedValue: string;

  @Input()
  showCancelAndConfirm = true;

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime | string }>();

  @Output()
  onDataPicked = new EventEmitter<DateTime>();

  dateClass: MatCalendarCellClassFunction<string> = (
    date: string,
    view: 'month' | 'year' | 'multi-year'
  ): MatCalendarCellCssClasses => {
    console.log(this.otherDateInRange)
    //Check if the view is not month or if the range should not be displayed
    if (view !== 'month' || !this.shouldDisplayRange || !this.otherDateInRange) return '';
    //Format the dates to compare them later
    const formattedDate = new DateTime(date).format('DD/MM/YYYY');
    const formattedOtherDateInRange = new DateTime(this.otherDateInRange).format('DD/MM/YYYY');
    const formattedSelectedBuffer = new DateTime(this.selectedBuffer).format('DD/MM/YYYY');
    const formattedSelectedValue = new DateTime(this.selectedValue).format('DD/MM/YYYY');
    console.log(formattedDate, ' styling confirmed')
    //Check if the date is the selected date, the other date in range or the selected buffer for the calendar
    if ([formattedOtherDateInRange, formattedSelectedBuffer, formattedSelectedValue].includes(formattedDate)) {
      console.log(formattedDate, ' one of the selected dates', new DateTime(formattedOtherDateInRange).isBefore(formattedDate))
      //Apply the correct stylings based on whether the date is before or after the other selected date
      const inRangeStyles = `mat-calendar-body-in-range ${
        new DateTime(formattedOtherDateInRange).isBefore(formattedDate)
          ? 'mat-calendar-body-range-end'
          : 'mat-calendar-body-range-start'
      }`;
      //Check if the date is the same as the other date in range, if it is, apply the selected style
      return formattedDate === formattedOtherDateInRange ? `mat-calendar-selected-style ${inRangeStyles}` : inRangeStyles;
    }

    console.log('time to compare', formattedDate, formattedSelectedBuffer, formattedOtherDateInRange)
    console.log(formattedDate + ' is between: ' + new DateTime(formattedDate).isBetweenTwoDates(new DateTime(formattedSelectedBuffer), new DateTime(formattedOtherDateInRange)))

    //Check if the date is between the selected date and the other date in range and apply the in range style
    return new DateTime(formattedDate).isBetweenTwoDates(new DateTime(formattedSelectedBuffer), new DateTime(formattedOtherDateInRange))
      ? 'mat-calendar-body-in-range'
      : null;
  };

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    // changes.prop contains the old and the new value...
    this.datePicker.updateTodaysDate();
  }

  /**
   * Handles the selection of a month.
   * @param {string} event - The selected date in string format.
   * @param {string} minDate - The minimum date allowed in string format.
   */
  handleMonthSelected(event: string, minDate: string) {
    const selected = DateTime.at(this.selectedBuffer ? this.selectedBuffer : '');
    const current = DateTime.at(event);
    const minimum = DateTime.at(minDate);

    if (!(current.month() === selected.month() && current.year() === selected.year())) {
      if (current.format('YYYY-MM-DD') < minimum.format('YYYY-MM-DD')) {
        this.selectedBuffer = minDate;
      } else {
        this.selectedBuffer = event;
      }
    }
  }

  /**
   * Emits a custom button event.
   * @param {IonDatetime | string} dateTime - The date/time or string to emit.
   * @param {string} buttonType - The type of button event.
   */
  buttonEmit(dateTime: IonDatetime | string, buttonType: string) {
    if (buttonType !== 'back') {
      this.selectedBuffer = null;
    }
    this.customButtonEvent.emit({
      buttonType,
      data: dateTime,
    });
  }

  /**
   * Handles the change of the selected date.
   * @param {any} event - The event containing the new selected date.
   */
  onSelectedChange(event) {
    this.selectedBuffer = event;
    if (!this.showCancelAndConfirm) {
      this.onSelected(event);
    }
  }

  /**
   * Handles the back button action.
   */
  handleBackButton() {
    if (this.selectedValue) {
      this.datePicker.activeDate = this.selectedValue;
    } else {
      this.datePicker.activeDate = this.selectedBuffer ? this.selectedBuffer : this.datePicker.maxDate;
    }
  }

  onSelected(event: string) {
    this.selectedValue = this.selectedBuffer ? this.selectedBuffer : event;

    this.onDataPicked.emit(DateTime.at(this.selectedValue));
  }

  protected readonly DateHeaderComponent = DateHeaderComponent;
}
