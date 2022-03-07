import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { nonAlphaNumericValues } from '@shared/constants/field-validators/field-validators';

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
  focusedElement: string = null;

  // @TODO: Work out how to implement these?
  customStartDateOptions = {
    buttons: [{
      text: 'Clear',
      handler: () => this.startDate = '',
    },
    {
      text: 'Done',
      handler: ({ year, month, day }) => {
        this.startDate = `${year.text}-${month.text}-${day.text}`;
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
        this.endDate = `${year.text}-${month.text}-${day.text}`;
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
}
