import {
  Component, EventEmitter, Input, OnChanges, Output, ViewChild,
} from '@angular/core';
import { Candidate, TestCentre, TestSlot } from '@dvsa/mes-journal-schema';
import { Examiner, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { DateTime, Duration } from '@shared/helpers/date-time';
import {
  SearchablePicklistComponentWrapper,
} from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import {
  TestCentreJournalSelectCandidate,
  TestCentreJournalShowBookings
} from '@pages/test-centre-journal/test-centre-journal.actions';
import { CandidateTestSlot } from '../../models/candidate-test-slot';

export type CandidateData = {
  name: string,
  slot: TestSlot,
};

@Component({
  selector: 'candidate-search-card',
  templateUrl: 'candidate-search-card.html',
  styleUrls: ['candidate-search-card.scss'],
})
export class CandidateSearchCardComponent implements OnChanges {

  @ViewChild('candidatePicklist')
  candidateTypeAheadDropDown: SearchablePicklistComponentWrapper<CandidateData>;

  @ViewChild('testCentrePicklist')
  testCentreTypeAheadDropDown: SearchablePicklistComponentWrapper<TestCentre>;

  @Input()
  manuallyRefreshed: boolean;

  @Input()
  testCentreResults: TestCentreDetailResponse;

  @Input()
  testCentreName: string;

  @Input()
  testCentres: TestCentre[] = [];

  @Input()
  isLDTM: boolean = false;

  @Input()
  selectedTestCentre: TestCentre;

  @Output()
  testCentreChanged = new EventEmitter<TestCentre>();

  @Output()
  testCentreRemoved = new EventEmitter();

  today: DateTime = new DateTime();
  tomorrow: DateTime = new DateTime().add(1, Duration.DAY);
  candidateTestSlots: CandidateTestSlot[] = [];
  todaySlots: CandidateTestSlot[];
  tomorrowSlots: CandidateTestSlot[];
  shouldShowCandidateResults: boolean;
  selectedCandidateName: string;
  selectedCandidate: CandidateData;
  enableShowBookingButton: boolean = false;

  constructor(private store$: Store<StoreModel>) {}

  ngOnChanges(): void {
    if (this.manuallyRefreshed) {
      this.onManualRefresh();
    }
  }

  getCandidateList = (): CandidateData[] => {
    if (!this.testCentreResults) {
      return null;
    }
    const candidateNames: CandidateData[] = [];

    this.testCentreResults.examiners.forEach((examiner) => {
      examiner.journal?.testSlots
        .filter((testSlot) => testSlot?.booking?.candidate)
        .forEach((testSlot) => {
          const { candidate } = testSlot.booking;
          const candidateName: string = `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`;
          // only push distinct names to array
          if (!candidateNames.some((item) => item.name === candidateName)) {
            candidateNames.push({
              name: candidateName,
            } as CandidateData);
          }
        });
    });

    return candidateNames;
  };

  createCandidateSlots(examinersData: Examiner[], candidateName: string): void {
    this.candidateTestSlots = [];
    examinersData.forEach((examiner) => {
      if (examiner.journal && examiner.journal.testSlots && examiner.journal.testSlots.length > 0) {
        examiner.journal?.testSlots
          .filter((testSlot) => testSlot?.booking?.candidate)
          .forEach((testSlot) => {
            const { candidate } = testSlot.booking;
            if (this.getCandidateName(candidate) === candidateName) {
              this.candidateTestSlots.push({
                slot: testSlot,
                examinerName: examiner.name,
              });
            }
          });
      }
    });
    this.createTodayTomorrowSlots();
  }

  createTodayTomorrowSlots(): void {
    this.todaySlots = this.filterTestSlotsByDay(this.today);
    this.tomorrowSlots = this.filterTestSlotsByDay(this.tomorrow);
  }

  private filterTestSlotsByDay = (dateTime: DateTime): CandidateTestSlot[] => {
    return this.candidateTestSlots.filter((candidateTestSlot: CandidateTestSlot) => {
      return DateTime.at(candidateTestSlot.slot.slotDetail.start).daysDiff(dateTime) === 0;
    });
  };

  getCandidateName = (candidate: Candidate): string =>
    `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`;

  onCandidateDidChange(candidate: CandidateData): void {
    this.shouldShowCandidateResults = false;
    const isValidCandidate: boolean = !!(candidate && candidate.name);
    this.enableShowBookingButton = isValidCandidate;

    if (isValidCandidate) {
      this.selectedCandidate = candidate;
      this.selectedCandidateName = candidate.name;
      this.store$.dispatch(TestCentreJournalSelectCandidate());
      this.createCandidateSlots(this.testCentreResults.examiners, this.selectedCandidateName);
    }
  }

  onTestCentreDidChange(testCentre: TestCentre): void {
    if (testCentre) {
      this.onManualRefresh();
      this.testCentreChanged.emit(testCentre);
    }
  }

  showResults(): void {
    this.shouldShowCandidateResults = true;
    this.store$.dispatch(TestCentreJournalShowBookings());
  }

  onManualRefresh(): void {
    // reset all values on refresh
    this.shouldShowCandidateResults = false;
    this.enableShowBookingButton = false;
    this.candidateTypeAheadDropDown.clearInput();
  }

  get slashSeperatedTestCentres(): string {
    return this.testCentreName?.replace(/,/gi, ' /') ?? 'test centre';
  }

}
