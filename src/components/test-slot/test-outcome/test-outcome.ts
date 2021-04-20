import { Subscription, Observable, merge } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ModalController } from '@ionic/angular'; // Modal
import { select, Store } from '@ngrx/store';
import { isEmpty, startsWith } from 'lodash';
import { SlotDetail, TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { map } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  // JOURNAL_EARLY_START_MODAL,
  // JOURNAL_FORCE_CHECK_MODAL,
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_D,
  CAT_ADI_PART2,
  CAT_HOME_TEST,
  CAT_CPC,
  TestFlowPageNames,
} from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';

import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ActivateTest, StartTest } from '@store/tests/tests.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import { SetExaminerBooked } from '@store/tests/examiner-booked/examiner-booked.actions';
import {
  ResumingWriteUp,
  // EarlyStartModalDidEnter
} from '@store/journal/journal.actions';
// import { StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';
/* import { ModalEvent } from '@pages/journal/journal-rekey-modal/journal-rekey-modal.constants';
import {
  ModalEvent as EarlyStartModalEvent,
} from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal.constants';
 */

@Component({
  selector: 'test-outcome',
  templateUrl: 'test-outcome.html',
  styleUrls: ['test-outcome.scss'],
})
export class TestOutcomeComponent implements OnInit {

  @Input()
  slotDetail: SlotDetail;

  @Input()
  canStartTest: boolean;

  @Input()
  testStatus: TestStatus;

  @Input()
  activityCode: ActivityCode;

  @Input()
  specialRequirements: boolean;

  @Input()
  hasSeenCandidateDetails: boolean;

  @Input()
  isRekey: boolean;

  @Input()
  isDelegatedTest: boolean = false;

  @Input()
  examinerId: number;

  @Input()
  category: TestCategory;

  @Input()
  showTestActionButton: boolean = true;

  // modal: Modal;
  startTestAsRekey: boolean = false;
  isTestSlotOnRekeySearch: boolean = false;

  candidateDetailsViewed: boolean;
  subscription: Subscription;
  seenCandidateDetails$: Observable<boolean>;

  constructor(
    private store$: Store<StoreModel>,
    private router: Router,
    private routeByCat: RouteByCategoryProvider,
    // private modalController: ModalController,
  ) {
  }

  ngOnInit() {
    const bookedTestSlot$ = this.store$.pipe(
      select(getRekeySearchState),
      map(getBookedTestSlot),
    );

    const merged$ = merge(
      bookedTestSlot$.pipe(
        map((testSlot: TestSlot) => {
          if (isEmpty(testSlot)) {
            this.isTestSlotOnRekeySearch = false;
            return;
          }

          if (testSlot.slotDetail.slotId === this.slotDetail.slotId) {
            this.isTestSlotOnRekeySearch = true;
          }
        }),
      ),
    );

    this.subscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showOutcome(): boolean {
    return [TestStatus.Completed, TestStatus.Submitted].includes(this.testStatus);
  }

  showRekeyButton(): boolean {
    if (this.testStatus === TestStatus.Completed || this.testStatus === TestStatus.Submitted) {
      return false; // because the test is complete
    }

    if (this.isDelegatedTest) {
      return false;
    }

    if (this.isTestSlotOnRekeySearch) {
      return true; // because the test is incomplete AND this is the rekey search
    }

    if (this.isRekey && this.isDateInPast()) {
      return true; // because the test is incomplete AND this is not the rekey search...
      // ...AND it was started as a rekey AND the test date is in the past
    }

    // the test is incomplete AND this is not the rekey search AND it was not started as a rekey
    if (this.isDateInPast() && (this.testStatus === null || this.testStatus === TestStatus.Booked)) {
      return true; // because the test date is in the past AND it has never been seen OR started
    }
    return false;
  }

  showStartTestButton(): boolean {
    return !this.isDelegatedTest && (this.testStatus === TestStatus.Booked);
  }

  showDelegatedExaminerRekeyButton(): boolean {
    return this.isDelegatedTest && !this.showResumeButton();
  }

  showResumeButton(): boolean {
    return this.testStatus === TestStatus.Started || this.testStatus === TestStatus.Decided;
  }

  showWriteUpButton(): boolean {
    return this.testStatus === TestStatus.WriteUp || this.testStatus === TestStatus.Autosaved;
  }

  writeUpTest() {
    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));
    this.store$.dispatch(ResumingWriteUp(this.slotDetail.slotId.toString()));
    this.router.navigate(this.getOfficePage());
  }

  resumeTest() {
    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));
    if (this.testStatus === TestStatus.Started) {
      this.router.navigate(this.getTestStartingPage());
    } else if (this.activityCode === ActivityCodes.PASS) {
      this.router.navigate(this.getPassFinalisationPage());
    } else {
      this.router.navigate(this.getNonPassFinalisationPage());
    }
  }

  async startTest() {
    if (this.isE2EPracticeMode()) {
      // this.store$.dispatch(StartE2EPracticeTest(this.slotDetail.slotId.toString()));
    } else {
      this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, this.startTestAsRekey || this.isRekey));
    }
    console.log('here');
    await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_PAGE, this.category);
  }

  rekeyTest() {
    if (this.testStatus === null || this.testStatus === TestStatus.Booked) {
      this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, true, false));
    } else {
      this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category, true));
    }
    switch (this.category) {
      case TestCategory.ADI2:
        this.router.navigate([CAT_ADI_PART2.WAITING_ROOM_PAGE]);
        break;
      // case TestCategory.B:
      //   this.router.navigate([CAT_B.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.BE:
      //   this.router.navigate([CAT_BE.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.CE:
      // case TestCategory.C1E:
      // case TestCategory.C1:
      // case TestCategory.C:
      //   this.router.navigate([CAT_C.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.CCPC:
      // case TestCategory.DCPC:
      //   this.router.navigate([CAT_CPC.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.DE:
      // case TestCategory.D1E:
      // case TestCategory.D1:
      // case TestCategory.D:
      //   this.router.navigate([CAT_D.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.EUAM1:
      // case TestCategory.EUA1M1:
      // case TestCategory.EUA2M1:
      // case TestCategory.EUAMM1:
      //   this.router.navigate([CAT_A_MOD1.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.EUAM2:
      // case TestCategory.EUA1M2:
      // case TestCategory.EUA2M2:
      // case TestCategory.EUAMM2:
      //   this.router.navigate([CAT_A_MOD2.WAITING_ROOM_PAGE]);
      //   break;
      // case TestCategory.K:
      // case TestCategory.H:
      // case TestCategory.G:
      // case TestCategory.F:
      //   this.router.navigate([CAT_HOME_TEST.WAITING_ROOM_PAGE]);
      //   break;
      default:
    }
  }

  rekeyDelegatedTest(): void {
    this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, true, true));
    this.store$.dispatch(SetExaminerConducted(this.examinerId));
    this.store$.dispatch(SetExaminerBooked(this.examinerId));

    switch (this.category) {
      case TestCategory.BE:
        this.router.navigate([CAT_BE.WAITING_ROOM_TO_CAR_PAGE]);
        break;
      case TestCategory.CE:
      case TestCategory.C1E:
      case TestCategory.C1:
      case TestCategory.C:
        this.router.navigate([CAT_C.WAITING_ROOM_TO_CAR_PAGE]);
        break;
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        this.router.navigate([CAT_CPC.WAITING_ROOM_TO_CAR_PAGE]);
        break;
      case TestCategory.DE:
      case TestCategory.D1E:
      case TestCategory.D1:
      case TestCategory.D:
        this.router.navigate([CAT_D.WAITING_ROOM_TO_CAR_PAGE]);
        break;
      default:
    }
  }

  /* displayRekeyModal = (): void => {
    const options = { cssClass: 'mes-modal-alert text-zoom-regular' };
    this.modal = this.modalController.create('JournalRekeyModal', {}, options);
    this.modal.onDidDismiss(this.onModalDismiss);
    this.modal.present();
  }; */

  /* displayCheckStartModal = (): void => {
    this.store$.dispatch(new EarlyStartModalDidEnter());
    const options = { cssClass: 'mes-modal-alert text-zoom-regular' };
    this.modal = this.modalController.create(JOURNAL_EARLY_START_MODAL, { slotData: this.slotDetail }, options);
    this.modal.onDidDismiss((event: EarlyStartModalEvent) => {
      switch (event) {
        case ModalEvent.START:
          this.startTestAsRekey = false;
          this.isRekey = false;
          if (this.testStatus !== null) {
            this.store$.dispatch(new MarkAsNonRekey());
          }
          this.startOrResumeTestDependingOnStatus();
          break;
        case ModalEvent.CANCEL:
          break;
        default:
      }
    });
    this.modal.present();
  }; */

  /* displayForceCheckModal = (): void => {
    const options = { cssClass: 'mes-modal-alert text-zoom-regular' };
    this.modal = this.modalController.create(JOURNAL_FORCE_CHECK_MODAL, {}, options);
    this.modal.onDidDismiss(this.onModalDismiss);
    this.modal.present();
  }; */

  /* onModalDismiss = (event: ModalEvent): void => {
    switch (event) {
      case ModalEvent.START:
        this.startTestAsRekey = false;
        this.isRekey = false;
        if (this.testStatus !== null) {
          this.store$.dispatch(new MarkAsNonRekey());
        }
        this.startOrResumeTestDependingOnStatus();
        break;
      case ModalEvent.REKEY:
        this.startTestAsRekey = true;
        this.startOrResumeTestDependingOnStatus();
        break;
      default:
    }
  }; */

  shouldDisplayRekeyModal(): boolean {
    return this.isTestIncomplete() && this.isTodaysDate() && this.hasTestTimeFinished();
  }

  async clickStartOrResumeTest() {
    // @TODO: Implement Start Test Logic
    // if (this.specialRequirements && !this.hasSeenCandidateDetails) {
    //   this.displayForceCheckModal();
    //   return;
    // }
    // if (this.shouldDisplayRekeyModal() && !this.isE2EPracticeMode()) {
    //   this.displayRekeyModal();
    //   return;
    // }
    // if (this.shouldDisplayCheckStartModal()) {
    //   this.displayCheckStartModal();
    //   return;
    // }
    await this.startOrResumeTestDependingOnStatus();
  }

  shouldDisplayCheckStartModal(): boolean {
    const minsUntilTest = new DateTime().compareDuration(this.slotDetail.start, Duration.MINUTE);
    return minsUntilTest > 5;
  }

  isE2EPracticeMode(): boolean {
    return startsWith(this.slotDetail.slotId.toString(), end2endPracticeSlotId);
  }

  isDateInPast() {
    return new DateTime().daysDiff(this.slotDetail.start) < 0;
  }

  isTodaysDate() {
    return new DateTime().daysDiff(this.slotDetail.start) === 0;
  }

  isTestIncomplete(): boolean {
    return [TestStatus.Booked, TestStatus.Started, TestStatus.Decided].includes(this.testStatus);
  }

  hasTestTimeFinished(): boolean {
    const cutOffTime = new DateTime(this.slotDetail.start).add(10, Duration.MINUTE);
    return new DateTime() > cutOffTime;
  }

  async startOrResumeTestDependingOnStatus() {
    if (this.testStatus === TestStatus.Booked) {
      await this.startTest();
    } else {
      this.resumeTest();
    }
  }

  getTestStartingPage(): [string] {
    switch (this.category as TestCategory) {
      case TestCategory.ADI2:
        return [CAT_ADI_PART2.WAITING_ROOM_PAGE];
      case TestCategory.B:
        return [CAT_B.WAITING_ROOM_PAGE];
      case TestCategory.BE:
        return [CAT_BE.WAITING_ROOM_PAGE];
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return [CAT_C.WAITING_ROOM_PAGE];
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return [CAT_CPC.WAITING_ROOM_PAGE];
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return [CAT_A_MOD1.WAITING_ROOM_PAGE];
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return [CAT_A_MOD2.WAITING_ROOM_PAGE];
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return [CAT_D.WAITING_ROOM_PAGE];
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return [CAT_HOME_TEST.WAITING_ROOM_PAGE];
      default:
    }
  }

  getPassFinalisationPage(): [string] {
    switch (this.category as TestCategory) {
      case TestCategory.ADI2:
        return [CAT_ADI_PART2.PASS_FINALISATION_PAGE];
      case TestCategory.B:
        return [CAT_B.PASS_FINALISATION_PAGE];
      case TestCategory.BE:
        return [CAT_BE.PASS_FINALISATION_PAGE];
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return [CAT_C.PASS_FINALISATION_PAGE];
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return [CAT_CPC.PASS_FINALISATION_PAGE];
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return [CAT_A_MOD1.PASS_FINALISATION_PAGE];
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return [CAT_A_MOD2.PASS_FINALISATION_PAGE];
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return [CAT_D.PASS_FINALISATION_PAGE];
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return [CAT_HOME_TEST.PASS_FINALISATION_PAGE];
      default:
    }
  }

  getNonPassFinalisationPage(): [string] {
    switch (this.category as TestCategory) {
      case TestCategory.ADI2:
        return [CAT_ADI_PART2.NON_PASS_FINALISATION_PAGE];
      case TestCategory.B:
        return [CAT_B.NON_PASS_FINALISATION_PAGE];
      case TestCategory.BE:
        return [CAT_BE.NON_PASS_FINALISATION_PAGE];
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return [CAT_C.NON_PASS_FINALISATION_PAGE];
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return [CAT_CPC.NON_PASS_FINALISATION_PAGE];
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return [CAT_A_MOD1.NON_PASS_FINALISATION_PAGE];
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return [CAT_A_MOD2.NON_PASS_FINALISATION_PAGE];
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return [CAT_D.NON_PASS_FINALISATION_PAGE];
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return [CAT_HOME_TEST.NON_PASS_FINALISATION_PAGE];
      default:
    }
  }

  getOfficePage(): [string] {
    switch (this.category as TestCategory) {
      case TestCategory.ADI2:
        return [CAT_ADI_PART2.OFFICE_PAGE];
      case TestCategory.B:
        return [CAT_B.OFFICE_PAGE];
      case TestCategory.BE:
        return [CAT_BE.OFFICE_PAGE];
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return [CAT_C.OFFICE_PAGE];
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return [CAT_CPC.OFFICE_PAGE];
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return [CAT_A_MOD1.OFFICE_PAGE];
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return [CAT_A_MOD2.OFFICE_PAGE];
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return [CAT_D.OFFICE_PAGE];
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return [CAT_HOME_TEST.OFFICE_PAGE];
      default:
    }
  }
}
