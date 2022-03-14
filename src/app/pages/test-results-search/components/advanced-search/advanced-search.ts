import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { nonAlphaNumericValues } from '@shared/constants/field-validators/field-validators';
import * as moment from 'moment';

@Component({
  selector: 'advanced-search',
  templateUrl: 'advanced-search.html',
  styleUrls: ['advanced-search.scss'],
})
export class AdvancedSearchComponent {

  @Input()
  showSpinner: boolean;

  @Output()
  onSearchTests = new EventEmitter<AdvancedSearchParams>();

  dtcNumber: string = '';
  staffNumber: string = '';
  startDate: string = '';
  endDate: string = '';
  compareStartDate: Date = null;
  compareEndDate: Date = null;
  minimumEndDate: string = moment().format('YYYY-MM-DD');
  focusedElement: string = null;
  currentDate: any = new Date().toISOString().substring(0, 10);

  today = moment().format('YYYY-MM-DD');
  minStartDate = moment().subtract(2, 'years').format('YYYY-MM-DD');

  // @TODO: Work out how to implement these?
  customStartDateOptions = {
    buttons: [{
      text: 'Clear',
      handler: () => this.startDate = '',
    },
    {
      text: 'Done',
      handler: ({ year, month, day }) => {
        this.startDate = '';

        const newStartDate: string = `${year.text}-${month.text}-${day.text}`;

        console.log('newStartDate', newStartDate);

        if (newStartDate && this.endDate && moment(newStartDate).isAfter(this.endDate)) {
          console.log(`Start date is after end date, setting too ${this.endDate}`);
          this.startDate = this.endDate;
          this.endDate = this.startDate;
          console.log('This would make this.startDate', this.endDate);
          return;
        }
        console.log('else newStartDate', newStartDate);
        this.startDate = newStartDate;
      },
    }],
  };

  customEndDateOptions = {
    buttons: [{
      text: 'Clear',
      handler: () => this.endDate = '',
    },
    {
      text: 'Done',
      handler: ({ year, month, day }) => {
        this.endDate = '';

        const newEndDate: string = `${year.text}-${month.text}-${day.text}`;

        console.log('newEndDate', newEndDate);

        if (newEndDate && this.startDate && moment(newEndDate).isBefore(this.startDate)) {
          console.log(`End date is before start date, setting too ${this.startDate}`);
          this.endDate = this.startDate;
          this.startDate = this.endDate;
          console.log('This would make this.endDate', this.startDate);
          return;
        }
        console.log('else newEndDate', newEndDate);
        this.endDate = newEndDate;
      },
    }],
  };

  dtcNumberChanged(val: string): void {
    this.dtcNumber = val;
  }

  staffNumberChanged(event: any): void {
    const staffNumber: string = event.target.value?.replace(nonAlphaNumericValues, '').toUpperCase();
    event.target.value = staffNumber;
    this.staffNumber = staffNumber;
  }

  searchTests(): void {
    const advancedSearchParams: AdvancedSearchParams = {
      startDate: this.startDate,
      endDate: this.endDate,
      staffNumber: removeLeadingZeros(this.staffNumber),
      costCode: this.dtcNumber,
    };
    this.onSearchTests.emit(advancedSearchParams);
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

  onDateChange($: any, picker: 'start' | 'end') {
    console.log($.target);
    console.log(picker);
  }
}
