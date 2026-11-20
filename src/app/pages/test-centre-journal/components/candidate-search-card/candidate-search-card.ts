import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SearchablePicklistComponentWrapper } from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { Candidate, TestCentre, TestSlot } from '@dvsa/mes-journal-schema';
import { IonButton, IonCol, IonGrid, IonList, IonRow, IonText } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  TestCentreJournalSelectCandidate,
  TestCentreJournalShowBookings,
} from '@pages/test-centre-journal/test-centre-journal.actions';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { Examiner, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { SearchablePicklistComponentWrapper as SearchablePicklistComponentWrapper_1 } from '../../../../../components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { CandidateTestSlot } from '../../models/candidate-test-slot';
import { TestCentreNameComponent } from '../test-centre-name/test-centre-name';

export type CandidateData = {
  name: string;
  slot: TestSlot;
};

@Component({
  selector: 'candidate-search-card',
  templateUrl: 'candidate-search-card.html',
  styleUrls: ['candidate-search-card.scss'],
  imports: [
    SearchablePicklistComponentWrapper_1,
    TestCentreNameComponent,
    IonRow,
    IonButton,
    IonText,
    IonGrid,
    IonCol,
    IonList,
    TestSlotComponent,
    DatePipe,
  ],
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
  isLDTM = false;

  @Input()
  selectedTestCentre: TestCentre;

  @Output()
  testCentreChanged = new EventEmitter<TestCentre>();

  @Output()
  testCentreRemoved = new EventEmitter();

  today: DateTime = new DateTime();
  tomorrow: DateTime = new DateTime().add(1, Duration.DAY);
  candidateTestSlots = signal<CandidateTestSlot[]>([]);
  todaySlots = signal<CandidateTestSlot[]>([]);
  tomorrowSlots = signal<CandidateTestSlot[]>([]);
  shouldShowCandidateResults = signal(false);
  selectedCandidateName = signal<string>(null);
  selectedCandidate = signal<CandidateData>(null);
  enableShowBookingButton = signal(false);
  readonly isPortrait = toSignal(this.orientationMonitorProvider.isPortraitMode$, { initialValue: false });

  constructor(
    private store$: Store<StoreModel>,
    public orientationMonitorProvider: OrientationMonitorProvider
  ) {}

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
    const candidateTestSlots: CandidateTestSlot[] = [];
    examinersData.forEach((examiner) => {
      if (examiner.journal?.testSlots && examiner.journal.testSlots.length > 0) {
        examiner.journal?.testSlots
          .filter((testSlot) => testSlot?.booking?.candidate)
          .forEach((testSlot) => {
            const { candidate } = testSlot.booking;
            if (this.getCandidateName(candidate) === candidateName) {
              candidateTestSlots.push({
                slot: testSlot,
                examinerName: examiner.name,
              });
            }
          });
      }
    });
    this.candidateTestSlots.set(candidateTestSlots);
    this.createTodayTomorrowSlots();
  }

  createTodayTomorrowSlots(): void {
    this.todaySlots.set(this.filterTestSlotsByDay(this.today));
    this.tomorrowSlots.set(this.filterTestSlotsByDay(this.tomorrow));
  }

  private filterTestSlotsByDay = (dateTime: DateTime): CandidateTestSlot[] => {
    return this.candidateTestSlots().filter((candidateTestSlot: CandidateTestSlot) => {
      return DateTime.at(candidateTestSlot.slot.slotDetail.start).daysDiff(dateTime) === 0;
    });
  };

  getCandidateName = (candidate: Candidate): string =>
    `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`;

  onCandidateDidChange(candidate: CandidateData): void {
    this.shouldShowCandidateResults.set(false);
    const isValidCandidate: boolean = !!candidate?.name;
    this.enableShowBookingButton.set(isValidCandidate);

    if (isValidCandidate) {
      this.selectedCandidate.set(candidate);
      this.selectedCandidateName.set(candidate.name);
      this.store$.dispatch(TestCentreJournalSelectCandidate());
      this.createCandidateSlots(this.testCentreResults.examiners, this.selectedCandidateName());
    }
  }

  onTestCentreDidChange(testCentre: TestCentre): void {
    if (testCentre) {
      this.onManualRefresh();
      this.testCentreChanged.emit(testCentre);
    }
  }

  showResults(): void {
    this.shouldShowCandidateResults.set(true);
    this.store$.dispatch(TestCentreJournalShowBookings());
  }

  onManualRefresh(): void {
    // reset all values on refresh
    this.shouldShowCandidateResults.set(false);
    this.enableShowBookingButton.set(false);
    this.candidateTypeAheadDropDown.clearInput();
  }

  get slashSeperatedTestCentres(): string {
    return this.testCentreName?.replace(/,/gi, ' /') ?? 'test centre';
  }
}
