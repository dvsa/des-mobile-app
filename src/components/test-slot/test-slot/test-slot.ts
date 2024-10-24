import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { get, isNil } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CompletedJournalSlot } from '@pages/journal/journal.page';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { SlotProvider } from '@providers/slot/slot';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SlotTypes } from '@shared/models/slot-types';
import { StoreModel } from '@shared/models/store.model';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCodeBySlotId,
  getPassCertificateBySlotId,
  getTestById,
  getTestStatus,
} from '@store/tests/tests.selector';
import { SlotComponent } from '../slot/slot';
import { vehicleDetails } from './test-slot.constants';

interface TestSlotComponentState {
  testStatus$: Observable<TestStatus>;
  isRehydrated$: Observable<boolean>;
  testActivityCode$: Observable<ActivityCode>;
  testPassCertificate$: Observable<string>;
  isRekey$: Observable<boolean>;
}

@Component({
  selector: 'test-slot',
  templateUrl: 'test-slot.html',
  styleUrls: ['test-slot.scss'],
})
export class TestSlotComponent implements SlotComponent, OnInit {
  @Input()
  slot: TestSlot;

  @Input()
  slots: TestSlot[];

  @Input()
  hasSlotChanged: boolean;

  @Input()
  hasSeenCandidateDetails: boolean;

  @Input()
  showLocation: boolean;

  @Input()
  delegatedTest = false;

  @Input()
  teamJournalCandidateResult = false;

  @Input()
  completedTestRecord?: CompletedJournalSlot;

  @Input()
  examinerName: string = null;

  @Input()
  isTeamJournal = false;

  @Input()
  isPracticeMode = false;

  @Input()
  isPortrait = false;

  @Input()
  isUnSubmittedTestSlotView = false;

  @Output()
  cancelFutureTestModal = new EventEmitter<void>();

  componentState: TestSlotComponentState;

  practiceTestStatus: TestStatus = TestStatus.Booked;

  canViewCandidateDetails = false;
  isTestCentreJournalADIBooking = false;
  protected readonly ActivityCodes = ActivityCodes;

  formatAppRef = formatApplicationReference;
  formatTestCategory: TestCategory;

  constructor(
    public appConfig: AppConfigProvider,
    public dateTimeProvider: DateTimeProvider,
    public store$: Store<StoreModel>,
    private slotProvider: SlotProvider,
    public categoryWhitelist: CategoryWhitelistProvider,
    public accessibilityService: AccessibilityService
  ) {}

  ngOnInit(): void {
    const { slotId } = this.slot.slotDetail;

    this.componentState = {
      testStatus$: this.store$.pipe(
        select(getTests),
        select((tests): TestStatus => {
          const testStatus = getTestStatus(tests, slotId);
          return testStatus === TestStatus.Autosaved
            ? testStatus
            : this.completedTestRecord?.activityCode
              ? TestStatus.Submitted
              : testStatus;
        })
      ),
      isRehydrated$: this.store$.pipe(
        select(getTests),
        map((tests: TestsModel) => {
          return this.completedTestRecord && !getActivityCodeBySlotId(tests, slotId);
        })
      ),
      testActivityCode$: this.store$.pipe(
        select(getTests),
        map((tests) => {
          return this.completedTestRecord?.activityCode || getActivityCodeBySlotId(tests, slotId);
        })
      ),
      testPassCertificate$: this.store$.pipe(
        select(getTests),
        map((tests) => {
          return this.completedTestRecord?.passCertificateNumber || getPassCertificateBySlotId(tests, slotId);
        })
      ),
      isRekey$: this.store$.pipe(
        select(getTests),
        map((tests) => getTestById(tests, this.slot.slotDetail.slotId.toString())),
        filter((test) => test !== undefined),
        select(getRekeyIndicator),
        select(isRekey)
      ),
    };

    this.canViewCandidateDetails = this.slotProvider.canViewCandidateDetails(this.slot);
    this.formatTestCategory = this.slot.booking.application.testCategory as TestCategory;
    this.isTestCentreJournalADIBooking = this.slotProvider.isTestCentreJournalADIBooking(this.slot, this.isTeamJournal);
  }

  isIndicatorNeededForSlot(): boolean {
    const additionalNeeds: boolean = this.isAdditionalNeedsSlot();
    const checkNeeded: boolean = this.slot.booking.application.entitlementCheck || false;
    const categoryCheckNeeded: boolean = this.slot.booking.application.categoryEntitlementCheck || false;
    const nonStandardTest: boolean = getSlotType(this.slot) !== SlotTypes.STANDARD_TEST;

    return additionalNeeds || checkNeeded || categoryCheckNeeded || nonStandardTest;
  }

  isAdditionalNeedsSlot(): boolean {
    const additionalNeeds = get(this.slot, 'booking.application.specialNeeds', '');
    return !isNil(additionalNeeds) && additionalNeeds.length > 0;
  }

  showVehicleDetails(): boolean {
    return vehicleDetails[this.slot.booking.application.testCategory as TestCategory];
  }

  showAdditionalCandidateDetails(): boolean {
    return isAnyOf(this.slot.booking.application.testCategory, [TestCategory.ADI2, TestCategory.ADI3, TestCategory.SC]);
  }

  canStartTest(): boolean {
    if (this.isPracticeMode) {
      return true;
    }
    return (
      this.slotProvider.canStartTest(this.slot) &&
      this.categoryWhitelist.isWhiteListed(this.slot.booking.application.testCategory as TestCategory)
    );
  }

  getExaminerId(): number {
    let returnValue = null;
    if (this.delegatedTest) {
      const slot = this.slot as DelegatedExaminerTestSlot;
      returnValue = slot.examinerId;
    }
    return returnValue;
  }

  isCompletedTest = (testStatus: TestStatus): boolean => testStatus === TestStatus.Completed;

  /**
   * Determines if the test held locally in an autosaved state
   * and exists remotely as autosaved
   * @param remoteAutosaved
   * @param testStatus
   */
  isAutosavedTest = (remoteAutosaved: boolean, testStatus: TestStatus): boolean => {
    return remoteAutosaved && testStatus !== TestStatus.Autosaved;
  };

  /**
   * Returns true if the test is autosaved, completed or submitted, we need to use a new function as
   * integrity-marker needs to display on a submitted test.
   */
  showRecoveredBanner = (isRehydrated: boolean, testStatus: TestStatus): boolean => {
    return isRehydrated && isAnyOf(testStatus, [TestStatus.Autosaved, TestStatus.Completed, TestStatus.Submitted]);
  };

  showOutcome(status: TestStatus): boolean {
    return [TestStatus.Completed, TestStatus.Submitted].includes(status);
  }

  emitCancelFutureTest() {
    this.cancelFutureTestModal.emit();
  }
}
