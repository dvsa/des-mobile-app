import { Subscription, merge } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { isEmpty, startsWith } from 'lodash';
import { SlotDetail, TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { map } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { JOURNAL_FORCE_CHECK_MODAL, TestFlowPageNames } from '@pages/page-names.constants';
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
  EarlyStartModalDidEnter,
} from '@store/journal/journal.actions';
import { StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';
import { MarkAsNonRekey } from '@store/tests/rekey/rekey.actions';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';
import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';
import { AppComponent } from '@app/app.component';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';

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
  isDelegatedTest: boolean = false;

  @Input()
  examinerId: number;

  @Input()
  category: TestCategory;

  @Input()
  showTestActionButton: boolean = true;

  @Input()
  slot: TestSlot;

  @Input()
  slotChanged: boolean;

  startTestAsRekey: boolean = false;
  isTestSlotOnRekeySearch: boolean = false;
  subscription: Subscription;

  constructor(
    private store$: Store<StoreModel>,
    private router: Router,
    private routeByCat: RouteByCategoryProvider,
    private modalController: ModalController,
    private app: AppComponent,
    private categoryWhitelistProvider: CategoryWhitelistProvider,
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
    return this.isDateInPast() && (this.testStatus === null || this.testStatus === TestStatus.Booked);
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

  async writeUpTest() {
    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));
    this.store$.dispatch(ResumingWriteUp(this.slotDetail.slotId?.toString()));
    await this.routeByCat.navigateToPage(TestFlowPageNames.OFFICE_PAGE, this.category);
  }

  async resumeTest() {
    this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category));

    if (this.testStatus === TestStatus.Started) {
      await this.router.navigate([TestFlowPageNames.WAITING_ROOM_PAGE]);
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
    await this.router.navigate([TestFlowPageNames.WAITING_ROOM_PAGE]);
  }

  async rekeyTest() {
    if (this.testStatus === null || this.testStatus === TestStatus.Booked) {
      this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, true, false));
    } else {
      this.store$.dispatch(ActivateTest(this.slotDetail.slotId, this.category, true));
    }
    await this.router.navigate([TestFlowPageNames.WAITING_ROOM_PAGE]);
  }

  async rekeyDelegatedTest(): Promise<void> {
    this.store$.dispatch(StartTest(this.slotDetail.slotId, this.category, true, true));
    this.store$.dispatch(SetExaminerConducted(this.examinerId));
    this.store$.dispatch(SetExaminerBooked(this.examinerId));
    await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, this.category);
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
        textZoomClass: `mes-modal-alert ${this.app.getTextZoomClass()}`,
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
        if (this.testStatus !== null) {
          this.store$.dispatch(MarkAsNonRekey());
        }
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
    if (this.specialRequirements && !this.hasSeenCandidateDetails) {
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
    if (this.shouldDisplayCheckStartModal()) {
      await this.displayCheckStartModal();
      return;
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
