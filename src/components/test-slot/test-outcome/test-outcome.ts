import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SlotDetail, TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { JOURNAL_FORCE_CHECK_MODAL, TestFlowPageNames } from '@pages/page-names.constants';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { isEmpty, startsWith } from 'lodash-es';
import { Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';
import { StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';
import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';
import { JournalFutureTestModal } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';
import { ContinueUnuploadedTest } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { EarlyStartModalDidEnter, ResumingWriteUp } from '@store/journal/journal.actions';
import { SetExaminerBooked } from '@store/tests/examiner-booked/examiner-booked.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ActivateTest, StartTest } from '@store/tests/tests.actions';

@Component({
  selector: 'test-outcome',
  templateUrl: 'test-outcome.html',
  styleUrls: ['test-outcome.scss'],
})
export class TestOutcomeComponent implements OnInit {
  @Input()
  applicationId: number;

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
  isDelegatedTest = false;

  @Input()
  examinerId: number;

  @Input()
  category: TestCategory;

  @Input()
  showTestActionButton = true;

  @Input()
  slot: TestSlot;

  @Input()
  slotChanged: boolean;

  @Input()
  isPracticeMode?: boolean = false;

  @Input()
  hasNavigatedFromUnsubmitted = false;

  @Output()
  cancelFutureTestModal = new EventEmitter<void>();

  startTestAsRekey = false;
  isTestSlotOnRekeySearch = false;
  subscription: Subscription;

  constructor(
    private store$: Store<StoreModel>,
    private router: Router,
    private routeByCat: RouteByCategoryProvider,
    private modalController: ModalController,
    private accessibilityService: AccessibilityService,
    private categoryWhitelistProvider: CategoryWhitelistProvider
  ) {}

  ngOnInit() {
    const bookedTestSlot$ = this.store$.pipe(select(getRekeySearchState), map(getBookedTestSlot));

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
        })
      )
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
    if ([TestStatus.Completed, TestStatus.Submitted, TestStatus.Autosaved].includes(this.testStatus)) {
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
    return this.isDateInPast() && this.testStatus !== TestStatus.Started;
  }

  showStartTestButton(): boolean {
    return !this.isDelegatedTest && this.testStatus === TestStatus.Booked;
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

  async writeUpTest() {
    if (this.hasNavigatedFromUnsubmitted) {
      this.store$.dispatch(ContinueUnuploadedTest(TestStatus.WriteUp));
    }

    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));
    this.store$.dispatch(ResumingWriteUp(this.slotDetail.slotId?.toString()));

    await this.routeByCat.navigateToPage(TestFlowPageNames.OFFICE_PAGE, this.category, {
      state: { hasNavigatedFromUnsubmitted: this.hasNavigatedFromUnsubmitted },
    });
  }

  async resumeTest() {
    if (this.hasNavigatedFromUnsubmitted) {
      this.store$.dispatch(ContinueUnuploadedTest('Resume'));
    }

    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));

    if (this.testStatus === TestStatus.Started) {
      await this.router.navigate([
        this.category !== TestCategory.SC ? TestFlowPageNames.WAITING_ROOM_PAGE : TestFlowPageNames.COMMUNICATION_PAGE,
      ]);
    } else if (this.activityCode === ActivityCodes.PASS) {
      await this.routeByCat.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, this.category);
    } else {
      await this.routeByCat.navigateToPage(TestFlowPageNames.NON_PASS_FINALISATION_PAGE);
    }
  }

  async startTest() {
    if (this.isE2EPracticeMode()) {
      this.store$.dispatch(StartE2EPracticeTest(this.slotDetail.slotId.toString(), this.category));
    } else {
      this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, this.startTestAsRekey || this.isRekey));
    }

    await this.router.navigate([
      this.category !== TestCategory.SC ? TestFlowPageNames.WAITING_ROOM_PAGE : TestFlowPageNames.COMMUNICATION_PAGE,
    ]);
  }

  async rekeyTest() {
    if (this.hasNavigatedFromUnsubmitted) {
      this.store$.dispatch(ContinueUnuploadedTest('Rekey'));
    }

    if (this.testStatus === null || this.testStatus === TestStatus.Booked) {
      this.store$.dispatch(
        StartTest(
          this.slotDetail.slotId,
          this.category,
          true,
          false,
          DateTime.at(this.slotDetail.start).format('YYYY-MM-DD')
        )
      );
    } else {
      this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category, true));
    }
    await this.router.navigate([
      this.category !== TestCategory.SC ? TestFlowPageNames.WAITING_ROOM_PAGE : TestFlowPageNames.COMMUNICATION_PAGE,
    ]);
  }

  async rekeyDelegatedTestStart() {
    this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, true, true));
    this.store$.dispatch(SetExaminerConducted(this.examinerId));
    this.store$.dispatch(SetExaminerBooked(this.examinerId));
    await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, this.category);
  }

  async rekeyDelegatedTest(): Promise<void> {
    //compare the current date to the date of the test without factoring in time to see if the test is in the future
    if (new Date(new Date(this.slot.slotDetail.start).toDateString()) > new Date(new Date().toDateString())) {
      const modal: HTMLIonModalElement = await this.modalController.create({
        component: JournalFutureTestModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
      await modal.present();
      const { data } = await modal.onDidDismiss<ModalEvent>();
      if (data === ModalEvent.START) {
        await this.rekeyDelegatedTestStart();
      } else {
        this.cancelFutureTestModal.emit();
      }
    } else {
      await this.rekeyDelegatedTestStart();
    }
  }

  displayRekeyModal = async (): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: JournalRekeyModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  displayCheckStartModal = async (): Promise<void> => {
    this.store$.dispatch(EarlyStartModalDidEnter());

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: JournalEarlyStartModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: { slotData: this.slotDetail },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  displayForceCheckModal = async (): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: JournalForceCheckModal,
      id: JOURNAL_FORCE_CHECK_MODAL,
      componentProps: {
        slot: this.slot,
        slotChanged: this.slotChanged,
        isTeamJournal: !this.showTestActionButton,
        textZoomClass: `mes-modal-alert ${this.accessibilityService.getTextZoomClass()}`,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  displayCategoryPreviewModeModal = async (): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: PreviewModeModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  onModalDismiss = async (event: ModalEvent): Promise<void> => {
    switch (event) {
      case ModalEvent.START:
        this.startTestAsRekey = false;
        this.isRekey = false;
        await this.startOrResumeTestDependingOnStatus();
        break;
      case ModalEvent.REKEY:
        this.startTestAsRekey = true;
        await this.startOrResumeTestDependingOnStatus();
        break;
      default:
    }
  };

  shouldDisplayRekeyModal(): boolean {
    return this.isTestIncomplete() && this.isTodaysDate() && this.hasTestTimeFinished();
  }

  clickStartOrResumeTest = async (): Promise<void> => {
    if (!this.isPracticeMode) {
      if ((this.specialRequirements || this.slot?.booking?.application?.fitMarker) && !this.hasSeenCandidateDetails) {
        await this.displayForceCheckModal();
        return;
      }
      if (this.shouldDisplayRekeyModal() && !this.isE2EPracticeMode()) {
        await this.displayRekeyModal();
        return;
      }
      if (this.isE2EPracticeMode() && !this.categoryWhitelistProvider.isWhiteListed(this.category)) {
        await this.displayCategoryPreviewModeModal();
        return;
      }
      if (this.shouldDisplayCheckStartModal() && !this.isE2EPracticeMode()) {
        await this.displayCheckStartModal();
        return;
      }
    }
    await this.startOrResumeTestDependingOnStatus();
  };

  shouldDisplayCheckStartModal(): boolean {
    const minsUntilTest = new DateTime().compareDuration(this.slotDetail.start, Duration.MINUTE);
    return minsUntilTest > 5;
  }

  isE2EPracticeMode(): boolean {
    return startsWith(this.slotDetail.slotId?.toString(), end2endPracticeSlotId);
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
      await this.resumeTest();
    }
  }
}
