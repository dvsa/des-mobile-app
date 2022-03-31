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

  @Input()
  importStaffNumber: string;

  @Output()
  onSearchTests = new EventEmitter<AdvancedSearchParams>();

  dtcNumber: string = '';
  staffNumber: string = '';
  startDate: string = '';
  endDate: string = '';
  compareStartDate: Date = null;
  compareEndDate: Date = null;
  focusedElement: string = null;
  currentDate: any = new Date().toISOString().substring(0, 10);

  today = moment().format('YYYY-MM-DD');
  minStartDate = moment().subtract(2, 'years').format('YYYY-MM-DD');

  customStartDateOptions = {
    buttons: [
      { text: 'Clear', handler: () => this.startDate = '' },
      {
        text: 'Done',
        handler: ({ year, month, day }) => {
          const selectedDate: string = `${year.text}-${month.text}-${day.text}`;

          if (selectedDate && this.endDate && moment(selectedDate).isSameOrAfter(this.endDate)) {
            this.startDate = this.endDate;
            return;
          }
          this.startDate = selectedDate;
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
        const selectedDate: string = `${year.text}-${month.text}-${day.text}`;

        if (selectedDate && this.startDate && moment(selectedDate).isSameOrBefore(this.startDate)) {
          this.endDate = this.startDate;
          return;
        }
        this.endDate = selectedDate;
      },
    }],
  };

  upperCaseAlphaNum(event: any): void {
    if (nonAlphaNumericValues.test(event.target.value)) {
      event.target.value = event.target.value.replace(nonAlphaNumericValues, '').toUpperCase();
    }
    event.target.value = event.target.value.toUpperCase();
  }

  searchTests(): void {
    const advancedSearchParams: AdvancedSearchParams = {
      startDate: this.startDate,
      endDate: this.endDate,
      staffNumber: removeLeadingZeros(this.importStaffNumber ? this.importStaffNumber : this.staffNumber),
      costCode: this.dtcNumber,
    };
    this.onSearchTests.emit(advancedSearchParams);
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }
}
