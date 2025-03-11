import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { DateHeaderComponent } from '@components/common/datetime-input/date-header/date-header.component';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';

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
  imports: [MatCalendar, IonicModule, NgIf, AsyncPipe],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],

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
  selectedValue: string;

  @Input()
  showCancelAndConfirm = true;

  @Output()
  customButtonEvent = new EventEmitter<{ buttonType: string; data: IonDatetime | string }>();

  @Output()
  onDataPicked = new EventEmitter<DateTime>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  dateClass: MatCalendarCellClassFunction<string> = (
    date: string,
    view: 'month' | 'year' | 'multi-year'
  ): MatCalendarCellCssClasses => {
    // Check if the view is not month or if the range should not be displayed
    if (view !== 'month' || !this.shouldDisplayRange || !this.otherDateInRange) return '';

    // Format the dates to compare them later
    const formattedDate = new DateTime(date);
    const formattedOtherDateInRange = new DateTime(this.otherDateInRange);
    const formattedSelectedValue = new DateTime(this.selectedValue);

    //Check if there is a gap at in between the two dates at all
    if (formattedOtherDateInRange.format('YYYY-MM-DD') === formattedSelectedValue.format('YYYY-MM-DD')) return '';

    if (
      [formattedSelectedValue.format('DD/MM/YYYY'), formattedOtherDateInRange.format('DD/MM/YYYY')].includes(
        formattedDate.format('DD/MM/YYYY')
      )
    ) {
      //G
      const compareDate =
        formattedSelectedValue.format('DD/MM/YYYY') === formattedDate.format('DD/MM/YYYY')
          ? formattedOtherDateInRange
          : formattedSelectedValue;

      // Apply the correct stylings based on whether the date is before or after the other selected date
      const inRangeStyles = `mat-calendar-body-in-range ${
        compareDate.isAfter(formattedDate.moment) ? 'mat-calendar-body-range-start' : 'mat-calendar-body-range-end'
      }`;

      // Check if the date is the same as the other date in range, if it is, apply the selected style
      return formattedDate.format('DD/MM/YYYY') !== formattedSelectedValue.format('DD/MM/YYYY')
        ? `mat-calendar-selected-style ${inRangeStyles}`
        : inRangeStyles;
    }

    // Check if the date is between the selected date and the other date in range and apply the in range style
    return formattedDate.isBetweenTwoDates(formattedSelectedValue, formattedOtherDateInRange)
      ? 'mat-calendar-body-in-range'
      : null;
  };

  ngOnChanges(changes: SimpleChanges) {
    this.refreshView();
  }

  refreshView() {
    this.datePicker.updateTodaysDate();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handles the selection of a month.
   * @param {string} event - The selected date in string format.
   * @param {string} minDate - The minimum date allowed in string format.
   */
  handleMonthSelected(event: string, minDate: string) {
    // Create DateTime objects for the selected buffer, current event, and minimum date
    const selected = DateTime.at(this.selectedValue ? this.selectedValue : '');
    const current = DateTime.at(event);
    const minimum = DateTime.at(minDate);

    // Check if the current date is not in the same month and year as the selected date
    if (!(current.month() === selected.month() && current.year() === selected.year())) {
      // If the current date is before the minimum date, set the selected buffer to the minimum date
      if (current.format('YYYY-MM-DD') < minimum.format('YYYY-MM-DD')) {
        this.onSelectedChange(minDate);
      } else {
        // Otherwise, set the selected buffer to the current event date
        this.onSelectedChange(event);
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
      this.selectedValue = null;
    }
    this.customButtonEvent.emit({
      buttonType,
      data: dateTime,
    });
  }

  /**
   * Handles the date selection change.
   * @param {string} event - The selected date in string format.
   */
  onSelectedChange(event: string) {
    this.selectedValue = event;
    this.datePicker.activeDate = this.selectedValue;
    if (!this.showCancelAndConfirm) {
      this.onSelectConfirmed();
    }
  }

  /**
   * Handles the back button action.
   */
  handleBackButton() {
    this.datePicker.activeDate = this.selectedValue ? this.selectedValue : this.datePicker.maxDate;
  }

  onSelectConfirmed() {
    this.onDataPicked.emit(new DateTime(this.selectedValue));
  }

  protected readonly DateHeaderComponent = DateHeaderComponent;
}
