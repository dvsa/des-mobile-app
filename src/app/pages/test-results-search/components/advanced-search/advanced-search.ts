import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { nonAlphaNumericValues } from '@shared/constants/field-validators/field-validators';
import * as moment from 'moment';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';

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

  activityCodes: any[] = this.populateActivityArray();
  testCategories: any[] = [
    'All',
    TestCategory.A,
    TestCategory.A1,
    TestCategory.A2,
    TestCategory.ADI2,
    TestCategory.ADI3,
    TestCategory.AM,
    TestCategory.B,
    TestCategory.B1,
    TestCategory.BE,
    TestCategory.C,
    TestCategory.C1,
    TestCategory.C1E,
    TestCategory.C1EM,
    TestCategory.C1M,
    TestCategory.CCPC,
    TestCategory.CE,
    TestCategory.CEM,
    TestCategory.CM,
    TestCategory.D,
    TestCategory.D1,
    TestCategory.D1E,
    TestCategory.D1EM,
    TestCategory.D1M,
    TestCategory.DCPC,
    TestCategory.DE,
    TestCategory.DEM,
    TestCategory.DM,
    TestCategory.EUA1M1,
    TestCategory.EUA1M2,
    TestCategory.EUA2M1,
    TestCategory.EUA2M2,
    TestCategory.EUAM1,
    TestCategory.EUAM2,
    TestCategory.EUAMM1,
    TestCategory.EUAMM2,
    TestCategory.F,
    TestCategory.G,
    TestCategory.H,
    TestCategory.K,
    TestCategory.SC,
  ];

  selectedActivity: any = this.activityCodes[0];
  selectedCategory: any = this.testCategories[0];
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

  populateActivityArray() {
    const activityCodeArray: any[] = [];
    for (let i = 0; i < activityCodeModelList.length; i += 1) {
      activityCodeArray.push(`${activityCodeModelList[i].activityCode} - ${activityCodeModelList[i].description}`);
    }
    activityCodeArray.unshift('All');
    return activityCodeArray;
  }

  upperCaseAlphaNum(event: any): void {
    if (nonAlphaNumericValues.test(event.target.value)) {
      event.target.value = event.target.value.replace(nonAlphaNumericValues, '').toUpperCase();
    }
    event.target.value = event.target.value.toUpperCase();
  }

  searchTests(): void {
    const activitySearchParam = this.selectedActivity.toString().split(' ', 1);
    const advancedSearchParams: AdvancedSearchParams = {
      startDate: this.startDate,
      endDate: this.endDate,
      staffNumber: removeLeadingZeros(this.importStaffNumber ? this.importStaffNumber : this.staffNumber),
      costCode: this.dtcNumber,
      activityFilter: this.selectedActivity.toString() === this.activityCodes[0]
        ? '' : activitySearchParam,
      categoryFilter: this.selectedCategory.toString() === this.testCategories[0]
        ? '' : this.selectedCategory.toString(),
    };
    this.onSearchTests.emit(advancedSearchParams);
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }
}
