import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { InputChangeEventDetail } from '@ionic/angular';
import { InputInputEventDetail } from '@ionic/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { nonAlphaNumericValues } from '@shared/constants/field-validators/field-validators';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { removeLeadingZeros } from '@shared/helpers/formatters';

export const TestCategories: TestCategory[] = [
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
  TestCategory.SC,
];

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

  @Input()
  testCentres: TestCentre[] = [];

  @Input()
  isOffline: boolean;

  @Output()
  onSearchTests = new EventEmitter<AdvancedSearchParams>();

  activityCodes: { activityCode: string; description: string }[] = [
    {
      activityCode: '',
      description: 'All',
    },
    ...activityCodeModelList,
  ];

  testCategories: string[] = ['All'].concat(TestCategories);

  selectedActivity: { activityCode: string; description: string } = this.activityCodes[0];
  selectedCategory: string = this.testCategories[0];
  passCertificateNumber = '';
  selectedTestCentre: TestCentre = null;
  staffNumber = '';
  startDate = '';
  endDate = '';
  rekeySearch = false;
  compareStartDate: Date = null;
  compareEndDate: Date = null;
  focusedElement: string = null;
  currentDate: string = new Date().toISOString().substring(0, 10);
  displayType = DisplayType;
  today = new DateTime().format('YYYY-MM-DD');
  todayPlaceholder = new DateTime().format('DD/MM/YYYY');
  minStartDate = new DateTime().subtract(2, Duration.YEAR).format('YYYY-MM-DD');
  minStartDatePlaceholder = new DateTime().subtract(2, Duration.YEAR).format('DD/MM/YYYY');

  constructor(public accessibilityService: AccessibilityService) {}

  blurElement(event: EventTarget) {
    if (!(event as HTMLElement).id?.includes('input')) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  onInputChange(event: InputChangeEventDetail | InputInputEventDetail, field: string): void {
    if (typeof event.value !== 'string') return;

    // Added logic here as it is used on the (ionInput) attribute of the staffNo. input field, sets toggle to unchecked
    if (event.value === '' && field === 'staffId' && !this.selectedTestCentre) {
      this.rekeySearch = false;
    }

    if (nonAlphaNumericValues.test(event.value)) {
      event.value = event.value?.replace(nonAlphaNumericValues, '').toUpperCase();
    }
    event.value = event.value?.toUpperCase();
  }

  searchTests(): void {
    const advancedSearchParams: AdvancedSearchParams = {
      startDate: this.startDate || this.minStartDate,
      endDate: this.endDate || this.today,
      staffNumber: removeLeadingZeros(this.importStaffNumber || this.staffNumber),
      costCode: this.selectedTestCentre?.costCode || '',
      activityCode: this.selectedActivity.activityCode ?? '',
      category: this.selectedCategory.toString() === this.testCategories[0] ? '' : this.selectedCategory.toString(),
      rekey: this.rekeySearch,
      passCertificateNumber: this.passCertificateNumber,
    };
    this.onSearchTests.emit(advancedSearchParams);
  }

  activitySelectChange(event: { activityCode: string; description: string }) {
    if (event) {
      this.selectedActivity = event;
    } else {
      this.selectedActivity = {
        activityCode: '',
        description: 'All',
      };
    }
  }

  categorySelectChange(event: string) {
    if (event) {
      this.selectedCategory = event;
    } else {
      this.selectedCategory = 'All';
    }
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

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

  toggleRekeySearch(): void {
    this.rekeySearch = !this.rekeySearch;
  }

  selectTestCentre($event: TestCentre) {
    if (!$event && !(this.importStaffNumber || this.staffNumber)) {
      this.rekeySearch = false;
    }
    this.selectedTestCentre = $event;
  }
}
