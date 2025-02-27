import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'date-header',
  templateUrl: './date-header.component.html',
  styleUrls: ['./date-header.component.scss'],
})
export class DateHeaderComponent<D> implements OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(
    protected calendar: MatCalendar<D>,
    protected dateAdapter: DateAdapter<D>,
    cdr: ChangeDetectorRef
  ) {
    calendar.stateChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get monthLabel() {
    return this.dateAdapter.format(this.calendar.activeDate, { month: 'long' }).toLocaleUpperCase();
  }

  get yearLabel() {
    return this.dateAdapter.format(this.calendar.activeDate, { year: 'numeric' }).toLocaleUpperCase();
  }

  previousClicked() {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
  }

  nextClicked() {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
  }

  changeToYear() {
    if (this.calendar.currentView !== 'multi-year') {
      this.calendar.currentView = 'multi-year';
    } else {
      this.calendar.currentView = 'month';
    }
  }
  changeToMonth() {
    if (this.calendar.currentView !== 'year') {
      this.calendar.currentView = 'year';
    } else {
      this.calendar.currentView = 'month';
    }
  }
}
