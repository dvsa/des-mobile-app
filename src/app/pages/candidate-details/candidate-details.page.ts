import { Component, OnDestroy, OnInit } from '@angular/core';
import { Business, TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController, NavParams } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import * as journalActions from '@store/journal/journal.actions';
import * as candidateDetailActions from '@store/candidate-details/candidate-details.actions';
import {
  getBusiness, getCategoryEntitlementCheckText, getDetails,
  getFitCaseNumber, getFitMarker,
  getTime, isCandidateCheckNeeded, isCategoryEntitlementChecked,
} from '@store/candidate-details/candidate-details.selector';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { Router } from '@angular/router';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { Observable, Subject } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getTestStatus } from '@store/tests/tests.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getJournalState } from '@store/journal/journal.reducer';
import {
  getCompletedTestOutcome,
  getCompletedTests,
} from '@store/journal/journal.selector';
import { ActivityCode } from '@dvsa/mes-search-schema';
import { map } from 'rxjs/operators';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SlotProvider } from '@providers/slot/slot';
import { Details } from './candidate-details.page.model';

interface CandidateDetailsPageState {
  name: string;
  time: string;
  details: Details;
  business: Business;
  candidateEntitlementCheck: boolean;
  categoryEntitlementCheck: boolean;
  categoryEntitlementCheckText: string;
  fitMarker: boolean;
  fitCaseNumber: string;
  testStatus$: Observable<TestStatus>;
  completedTestOutcome$: Observable<ActivityCode>;
}

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.page.html',
  styleUrls: ['./candidate-details.page.scss'],
})
export class CandidateDetailsPage implements OnInit, OnDestroy {
  pageState: CandidateDetailsPageState;
  selectedDate: string;
  slot: TestSlot;
  slots: TestSlot[];
  slotChanged: boolean = false;
  isTeamJournal: boolean = false;
  testCategory: TestCategory = null;
  idPrefix: string = 'candidate-details';
  prevSlot: TestSlot;
  nextSlot: TestSlot;
  private destroy$ = new Subject<{}>();

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public store$: Store<StoreModel>,
    public router: Router,
    public dateTimeProvider: DateTimeProvider,
    public appConfig: AppConfigProvider,
    public slotProvider: SlotProvider,
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (!this.slot) {
      this.slot = this.navParams.get('slot');
    }

    if (this.navParams.get('slots')) {
      if (!this.slots) {
        this.slots = this.navParams.get('slots');
      }
      this.slots = this.slots.filter((slot) => !!slot?.booking?.candidate);

      this.prevSlot = this.slots[this.slots.indexOf(this.slot) - 1];
      this.nextSlot = this.slots[this.slots.indexOf(this.slot) + 1];
    }

    this.slotChanged = this.navParams.get('slotChanged');
    this.isTeamJournal = this.navParams.get('isTeamJournal');

    setTimeout(() => {
      this.store$.dispatch(journalActions.ClearChangedSlot(this.slot.slotDetail.slotId));
    });

    this.pageState = {
      name: getCandidateName(this.slot.booking.candidate),
      time: getTime(this.slot),
      details: getDetails(this.slot),
      business: getBusiness(this.slot),
      candidateEntitlementCheck: isCandidateCheckNeeded(this.slot),
      categoryEntitlementCheck: isCategoryEntitlementChecked(this.slot),
      categoryEntitlementCheckText: getCategoryEntitlementCheckText(this.slot),
      fitMarker: getFitMarker(this.slot),
      fitCaseNumber: getFitCaseNumber(this.slot),
      testStatus$: this.store$.pipe(
        select(getTests),
        select((tests) => getTestStatus(tests, this.slot.slotDetail.slotId)),
      ),
      completedTestOutcome$: this.store$.pipe(
        select(getJournalState),
        select(getCompletedTests),
        map((completedTests) => getCompletedTestOutcome(completedTests, this.pageState.details.applicationRef)),
      ),
    };

    this.testCategory = this.pageState.details.testCategory as TestCategory;

    if (this.slotChanged) {
      this.store$.dispatch(candidateDetailActions.CandidateDetailsSlotChangeViewed(
        { slotId: this.slot.slotDetail.slotId },
      ));
    }
    setTimeout(() => {
      this.store$.dispatch(journalActions.ClearChangedSlot(this.slot.slotDetail.slotId));
    });
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(candidateDetailActions.CandidateDetailsViewDidEnter({ slot: this.slot }));

    if (!this.isTeamJournal) {
      this.store$.dispatch(journalActions.CandidateDetailsSeen({ slotId: this.slot.slotDetail.slotId }));
    }
  }

  public specialNeedsIsPopulated(specialNeeds: string | string[]): boolean {
    return Array.isArray(specialNeeds);
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss()
      .then(() => {
        this.store$.dispatch(candidateDetailActions.CandidateDetailsModalDismiss(
          { sourcePage: this.formatUrl(this.router.url) },
        ));
      });
  }

  /**
   * Strip the slash from the start of the url returned by the router
   * @param url
   */
  formatUrl(url: string): string {
    return url ? url.substring(1) : null;
  }

  changeCandidate(prevOrNext: string) {
    switch (prevOrNext) {
      case 'prev':
        this.slot = this.prevSlot;
        this.ngOnInit();
        break;
      case 'next':
        this.slot = this.nextSlot;
        this.ngOnInit();
        break;
      default:
        break;
    }
  }

  isCompleted(testStatus: TestStatus, completedTestOutcome: ActivityCode): boolean {
    if (completedTestOutcome) return true;
    return [TestStatus.Completed, TestStatus.Submitted].includes(testStatus);
  }

  /**
   * Do not display restricted categories when on test centre journals
   * if user doesnt conduct restricted tests
   */
  restrictDetails(): boolean {
    return this.slotProvider.canViewCandidateDetails(this.slot)
      && this.slotProvider.isTestCentreJournalADIBooking(this.slot, this.isTeamJournal);
  }

}
