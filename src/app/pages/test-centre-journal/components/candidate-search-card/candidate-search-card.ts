import {
  Component, Input, OnChanges, ViewChild,
} from '@angular/core';
import { Candidate, TestSlot } from '@dvsa/mes-journal-schema';
import { Examiner, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { TypeaheadDropdownComponent } from '@components/common/typeahead-dropdown/typeahead-dropdown';

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

  @ViewChild('typeAhead') typeAheadDropDown: TypeaheadDropdownComponent;

  @Input()
  manuallyRefreshed: boolean;

  @Input()
  testCentreResults: TestCentreDetailResponse;

  @Input()
  testCentreName: string;

  today: DateTime = new DateTime();
  tomorrow: DateTime = new DateTime().add(1, Duration.DAY);
  candidateTestSlots: CandidateTestSlot[] = [];
  todaySlots: CandidateTestSlot[];
  tomorrowSlots: CandidateTestSlot[];
  shouldShowCandidateResults: boolean;
  selectedCandidateName: string;
  enableShowBookingButton: boolean = false;

  ngOnChanges(): void {
    if (this.manuallyRefreshed) {
      this.onManualRefresh();
    }
  }

  getCandidateList = (): CandidateData[] => {
    if (!this.testCentreResults) {
      return null;
    }
    const extractedData: CandidateData[] = [];

    this.testCentreResults.examiners.forEach((examiner) => {
      examiner.journal?.testSlots
        .filter((testSlot) => testSlot?.booking?.candidate)
        .forEach((testSlot) => {
          const { candidate } = testSlot.booking;
          extractedData.push({
            name: `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`,
            slot: testSlot,
          });
        });
    });

    return extractedData;
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
      this.selectedCandidateName = candidate.name;
      this.createCandidateSlots(this.testCentreResults.examiners, this.selectedCandidateName);
    }
  }

  showResults(): void {
    this.shouldShowCandidateResults = true;
  }

  onManualRefresh(): void {
    // reset all values on refresh
    this.shouldShowCandidateResults = false;
    this.enableShowBookingButton = false;
    this.typeAheadDropDown.clearInput();
  }

}
