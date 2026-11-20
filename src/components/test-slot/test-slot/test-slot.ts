import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonButton, IonCard, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { SlotProvider } from '@providers/slot/slot';
import { getFormattedApplicationReference } from '@shared/helpers/formatters';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SlotTypes } from '@shared/models/slot-types';
import { StoreModel } from '@shared/models/store.model';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCodeBySlotId,
  getPassCertificateBySlotId,
  getTestById,
  getTestStatus,
} from '@store/tests/tests.selector';
import { get, isNil } from 'lodash-es';
import { AdditionalCandidateDetailsComponent } from '../additional-candidate-details/additional-candidate-details';
import { AutosaveStatusComponent } from '../autosave-status/autosave-status';
import { CandidateLinkComponent } from '../candidate-link/candidate-link';
import { DateComponent } from '../date/date';
import { ExaminerNameComponent } from '../examiner-name/examiner-name';
import { IndicatorsComponent } from '../indicators/indicators';
import { IntegrityMarkerComponent } from '../integrity-marker/integrity-marker';
import { LanguageComponent } from '../language/language';
import { LocationComponent } from '../location/location';
import { ProgressiveAccessComponent } from '../progressive-access/progressive-access';
import { SlotComponent } from '../slot/slot';
import { SubmissionStatusComponent } from '../submission-status/submission-status';
import { TestCategoryComponent } from '../test-category/test-category';
import { TestOutcomeComponent } from '../test-outcome/test-outcome';
import { TimeComponent } from '../time/time';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details';
import { vehicleDetails } from './test-slot.constants';

@Component({
  selector: 'test-slot',
  templateUrl: 'test-slot.html',
  styleUrls: ['test-slot.scss'],
  imports: [
    LocationComponent,
    NgClass,
    LanguageComponent,
    SubmissionStatusComponent,
    IntegrityMarkerComponent,
    AutosaveStatusComponent,
    IndicatorsComponent,
    TimeComponent,
    CandidateLinkComponent,
    TestCategoryComponent,
    TestOutcomeComponent,
    ExaminerNameComponent,
    DateComponent,
    ProgressiveAccessComponent,
    VehicleDetailsComponent,
    AdditionalCandidateDetailsComponent,
    IonCol,
    IonGrid,
    IonCard,
    IonRow,
    IonText,
    IonButton,
  ],
})
export class TestSlotComponent implements SlotComponent, OnInit {
  private readonly selectedSlot = signal<TestSlot>(null);
  private readonly completedRecord = signal<SearchResultTestSchema>(null);

  @Input()
  set slot(value: TestSlot) {
    this.selectedSlot.set(value);
  }
  get slot(): TestSlot {
    return this.selectedSlot();
  }

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
  set completedTestRecord(value: SearchResultTestSchema) {
    this.completedRecord.set(value);
  }
  get completedTestRecord(): SearchResultTestSchema {
    return this.completedRecord();
  }

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

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly slotId = computed(() => this.slot.slotDetail.slotId);
  testStatus = computed(() => {
    const status = getTestStatus(this.tests(), this.slotId());
    return status !== TestStatus.Autosaved && this.completedTestRecord?.activityCode ? TestStatus.Submitted : status;
  });
  isRehydrated = computed(() => !!this.completedTestRecord && !getActivityCodeBySlotId(this.tests(), this.slotId()));
  testActivityCode = computed(
    () => this.completedTestRecord?.activityCode || getActivityCodeBySlotId(this.tests(), this.slotId())
  );
  testPassCertificate = computed(
    () => this.completedTestRecord?.passCertificateNumber || getPassCertificateBySlotId(this.tests(), this.slotId())
  );
  isRekey = computed(() => {
    const test = getTestById(this.tests(), this.slotId().toString());
    return test ? isRekey(getRekeyIndicator(test)) : false;
  });

  practiceTestStatus: TestStatus = TestStatus.Booked;

  canViewCandidateDetails = false;
  isTestCentreJournalADIBooking = false;
  protected readonly ActivityCodes = ActivityCodes;

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

  protected readonly getFormattedApplicationReference = getFormattedApplicationReference;
}
