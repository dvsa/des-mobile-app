import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { nonAlphaNumericValues } from '@shared/constants/field-validators/field-validators';
import * as moment from 'moment';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { IonDatetime } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';

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

  activityCodes: { activityCode: string; description: string; }[] = [
    { activityCode: '', description: 'All' },
    ...activityCodeModelList,
  ];

  testCategories: string[] = [
    'All',
    TestCategory.ADI2,
    TestCategory.ADI3,
    TestCategory.B,
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
  ];

  selectedActivity: { activityCode: string; description: string; } = this.activityCodes[0];
  selectedCategory: string = this.testCategories[0];
  dtcNumber: string = '';
  staffNumber: string = '';
  startDate: string = '';
  endDate: string = '';
  compareStartDate: Date = null;
  compareEndDate: Date = null;
  focusedElement: string = null;
  currentDate: any = new Date().toISOString().substring(0, 10);
  displayType = DisplayType;
  today = moment().format('YYYY-MM-DD');
  todayPlaceholder = moment().format('DD/MM/YYYY');
  minStartDate = moment().subtract(2, 'years').format('YYYY-MM-DD');
  minStartDatePlaceholder = moment().subtract(2, 'years').format('DD/MM/YYYY');

  constructor(
    public appComponent: AppComponent,
  ) {
  }

  upperCaseAlphaNum(event: any): void {
    if (typeof event.target.value !== 'string') return;

    if (nonAlphaNumericValues.test(event.target.value)) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '').toUpperCase();
    }
    event.target.value = event.target.value?.toUpperCase();
  }

  searchTests(): void {
    const advancedSearchParams: AdvancedSearchParams = {
      startDate: this.startDate ? this.startDate : this.minStartDate,
      endDate: this.endDate ? this.endDate : this.today,
      staffNumber: removeLeadingZeros(this.importStaffNumber ? this.importStaffNumber : this.staffNumber),
      costCode: this.dtcNumber,
      activityCode: this.selectedActivity.activityCode ?? '',
      category: this.selectedCategory.toString() === this.testCategories[0]
        ? '' : this.selectedCategory.toString(),
    };
    this.onSearchTests.emit(advancedSearchParams);
  }

  activitySelectChange(event: { activityCode: string; description: string; }) {
    this.selectedActivity = event;
  }

  categorySelectChange(event: string) {
    this.selectedCategory = event;
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

  handleClear = (dateTime: IonDatetime, startEnd: 'start' | 'end'): Promise<void> => {
    if (startEnd === 'start') {
      this.startDate = '';
    } else {
      this.endDate = '';
    }
    return dateTime.cancel(true);
  };

  handleDone = (dateTime: IonDatetime, startEnd: 'start' | 'end'): Promise<void> => {
    return dateTime.confirm(false)
      .then(
        () => {
          // if date not set, then close the modal on done click as fail safe before handling the data;
          if (!dateTime.value) {
            return dateTime.confirm(true);
          }

          const selectedDate: string = moment(dateTime.value).format('YYYY-MM-DD');

          // start picker
          if (startEnd === 'start') {
            if (selectedDate && this.endDate && moment(selectedDate).isSameOrAfter(this.endDate)) {
              this.startDate = this.endDate;
            } else {
              this.startDate = selectedDate;
            }
            return;
          }

          // end picker
          if (selectedDate && this.startDate && moment(selectedDate).isSameOrBefore(this.startDate)) {
            this.endDate = this.startDate;
          } else {
            this.endDate = selectedDate;
          }
        },
      ).finally(() => dateTime.confirm(true));
  };

  changeDate(event: { control?: string; data: string }): void {
    switch (event.control) {
      case 'start-date':
        this.startDate = event.data;
        break;
      case 'end-date':
        this.endDate = event.data;
        break;
      default:
        break;
    }
  }
}
