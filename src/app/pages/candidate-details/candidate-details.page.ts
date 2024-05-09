import { Component, OnDestroy, OnInit } from '@angular/core';
import { Business, TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController, NavParams, ViewDidEnter } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import * as journalActions from '@store/journal/journal.actions';
import * as candidateDetailActions from '@store/candidate-details/candidate-details.actions';
import {
  getBusiness,
  getCategoryEntitlementCheckText,
  getDetails,
  getFitCaseNumber,
  getFitMarker,
  getTime,
  isCandidateCheckNeeded,
  isCategoryEntitlementChecked,
} from '@store/candidate-details/candidate-details.selector';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getTestStatus } from '@store/tests/tests.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getJournalState } from '@store/journal/journal.reducer';
import { getCompletedTestOutcome, getCompletedTests } from '@store/journal/journal.selector';
import { ActivityCode } from '@dvsa/mes-search-schema';
import { map } from 'rxjs/operators';
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
  templateUrl: 'candidate-details.page.html',
  styleUrls: ['candidate-details.page.scss'],
})
export class CandidateDetailsPage implements OnInit, OnDestroy, ViewDidEnter {
  pageState: CandidateDetailsPageState;
  selectedDate: string;
  slot: TestSlot;
  slots: TestSlot[];
  slotChanged: boolean = false;
  isTeamJournal: boolean = false;
  isRecovered: boolean = false;
  testCategory: TestCategory = null;
  idPrefix: string = 'candidate-details';
  prevSlot: TestSlot;
  nextSlot: TestSlot;
  restrictDetails: boolean = true;
  private destroy$ = new Subject<{}>();

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public store$: Store<StoreModel>,
    public router: Router,
    public slotProvider: SlotProvider,
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const navSlot = this.navParams.get('slot');
    const navSlots = this.navParams.get('slots');
    this.slotChanged = this.navParams.get('slotChanged');
    this.isTeamJournal = this.navParams.get('isTeamJournal');
    this.isRecovered = this.navParams.get('isRecovered');

    // if `slot` is not defined, then use the slot value from `navParams`
    // it will be undefined, when using the next/prev buttons as the value wouldn't be set via the Journal navigation
    if (!this.slot) this.slot = navSlot;

    // if `slots` is defined, we want to determine the prev/next slots using the navSlots
    if (navSlots) {
      if (!this.slots) this.slots = navSlots;

      // some slot types won't be displayed in the candidate details page (Corporate Connectivity), we remove those here
      this.slots = this.slots.filter((slot) => !!slot?.booking?.candidate);

      // lookup the current slots index, and reduce by one to get the previous slot
      this.prevSlot = this.slots[this.slots.indexOf(this.slot) - 1];

      // lookup the current slots index, and increment by one to get the next slot
      this.nextSlot = this.slots[this.slots.indexOf(this.slot) + 1];
    }

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

    this.restrictDetails = (
      this.slotProvider.canViewCandidateDetails(this.slot)
      && this.slotProvider.isTestCentreJournalADIBooking(this.slot, this.isTeamJournal)
    );
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(candidateDetailActions.CandidateDetailsViewDidEnter({ slot: this.slot }));

    if (!this.isTeamJournal) {
      this.store$.dispatch(journalActions.CandidateDetailsSeen({ slotId: this.slot.slotDetail.slotId }));
    }
  }

  public specialNeedsIsPopulated(specialNeeds: string[]): boolean {
    return specialNeeds.length && specialNeeds[0] !== 'None';
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss()
      .then(() => {
        this.store$.dispatch(candidateDetailActions.CandidateDetailsModalDismiss(
          { sourcePage: this.formatUrl(this.router.url) },
        ));
      });
  }

  formatUrl(url: string): string {
    // strip the slash from the start of the url returned by the router
    return url ? url.substring(1) : null;
  }

  changeCandidate(prevOrNext: string) {
    // we re-call the `ngOnInit` which mimics a new page load and therefore prev/current/next are re-calculated
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
    if (completedTestOutcome) {
      return true;
    }
    return [TestStatus.Completed, TestStatus.Submitted].includes(testStatus);
  }

}
