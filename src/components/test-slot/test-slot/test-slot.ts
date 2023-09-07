import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { get, isNil } from 'lodash';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { StoreModel } from '@shared/models/store.model';
import { SlotTypes } from '@shared/models/slot-types';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import {
  getActivityCodeBySlotId,
  getPassCertificateBySlotId,
  getTestById,
  getTestStatus,
} from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { vehicleDetails } from './test-slot.constants';
import { SlotComponent } from '../slot/slot';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ModalController } from '@ionic/angular';

interface TestSlotComponentState {
  testStatus$: Observable<TestStatus>;
  testActivityCode$: Observable<ActivityCode>;
  testPassCertificate$: Observable<String>;
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
    delegatedTest: boolean = false;

    @Input()
    teamJournalCandidateResult: boolean = false;

    @Input()
    derivedTestStatus: TestStatus | null = null;

    @Input()
    derivedActivityCode: ActivityCode | null = null;

    @Input()
    derivedPassCertificate?: string;

    @Input()
    examinerName: string = null;

    @Input()
    isTeamJournal: boolean = false;

    @Input()
    isPracticeMode?: boolean = false;

    @Input()
    isPortrait: boolean = false;

    @Input()
    widthData: { appRef: string, width: number, zoomLevel?: string };

    @Input()
    isUnSubmittedTestSlotView: boolean = false;

    @Output()
    colSizeDetails = new EventEmitter<{ appRef: string, width: number, zoomLevel?: string }>();

    componentState: TestSlotComponentState;
    testStatus: TestStatus;
    activityCode: ActivityCode;

    maxWidth: number;
    practiceTestStatus: TestStatus = TestStatus.Booked;

    canViewCandidateDetails: boolean = false;
    isTestCentreJournalADIBooking: boolean = false;

    formatAppRef = formatApplicationReference;
    formatTestCategory: TestCategory;

    constructor(
      public appConfig: AppConfigProvider,
      public dateTimeProvider: DateTimeProvider,
      public modalController: ModalController,
      public store$: Store<StoreModel>,
      private slotProvider: SlotProvider,
      public categoryWhitelist: CategoryWhitelistProvider,
      public accessibilityService: AccessibilityService,
    ) {
    }

    ngOnInit(): void {
      const { slotId } = this.slot.slotDetail;
      this.componentState = {
        testStatus$: this.store$.pipe(
          select(getTests),
          select((tests) => this.derivedTestStatus || getTestStatus(tests, slotId)),
          tap((value) => {
            this.testStatus = value;
          }),
        ),
        testActivityCode$: this.store$.pipe(
          select(getTests),
          map((tests) => this.derivedActivityCode || getActivityCodeBySlotId(tests, slotId)),
          tap((value) => {
            this.activityCode = value;
          }),
        ),
        testPassCertificate$: this.store$.pipe(
          select(getTests),
          map((tests) => this.derivedPassCertificate || getPassCertificateBySlotId(tests, slotId)),
        ),
        isRekey$: this.store$.pipe(
          select(getTests),
          map((tests) => getTestById(tests, this.slot.slotDetail.slotId.toString())),
          filter((test) => test !== undefined),
          select(getRekeyIndicator),
          select(isRekey),
        ),
      };

      this.canViewCandidateDetails = this.slotProvider.canViewCandidateDetails(this.slot);
      this.formatTestCategory = this.slot.booking.application.testCategory as TestCategory;
      this.isTestCentreJournalADIBooking = this.slotProvider.isTestCentreJournalADIBooking(
        this.slot, this.isTeamJournal,
      );
      if (this.widthData) {
        this.maxWidth = this.widthData.width;
      }
    }

    ngAfterViewChecked() {
      if (!(this.maxWidth > 0) || (this.widthData?.zoomLevel !== this.accessibilityService.getTextZoomClass())) {
        this.maxWidth = this.getCandidateLinkCol();
      }
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
      return isAnyOf(this.slot.booking.application.testCategory, [
        TestCategory.ADI2,
        TestCategory.ADI3,
        TestCategory.SC,
      ]);
    }

    canStartTest(): boolean {
      if (this.isPracticeMode) {
        return true;
      }
      return this.slotProvider.canStartTest(this.slot)
            && this.categoryWhitelist.isWhiteListed(this.slot.booking.application.testCategory as TestCategory);
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
    protected readonly ActivityCodes = ActivityCodes;

    displayTopRow(): boolean {
      return this.slot.booking.application.welshTest ||
            this.isTeamJournal ||
            this.isUnSubmittedTestSlotView ||
            (!this.isTeamJournal && this.isCompletedTest(this.testStatus)) ||
            (this.slot.booking.application.fitMarker && !this.isCompletedTest(this.testStatus));
    }

    displayBottomRow() {
      return this.delegatedTest ||
            this.slot.booking.application.progressiveAccess ||
            (this.isTeamJournal && !this.isTestCentreJournalADIBooking) ||
            (this.delegatedTest && this.slot.booking.candidate.driverNumber) ||
            (this.showVehicleDetails() && !this.delegatedTest && !this.isTeamJournal) ||
            (this.showAdditionalCandidateDetails() && !this.isTeamJournal && this.slot.booking.candidate) ||
            this.isUnSubmittedTestSlotView ||
            (this.activityCode === ActivityCodes.PASS);
    }

    getCandidateLinkCol(): number {
      const size = (document.getElementById(
        'candidate-col-' + this.formatAppRef(this.slot.booking.application),
      ).offsetWidth - 45);
      if (size >= 0) {
        this.colSizeDetails.emit(
          {
            width: size,
            appRef: this.formatAppRef(this.slot.booking.application),
            zoomLevel: this.accessibilityService.getTextZoomClass(),
          },
        );
      }
      return size;
    }
}
