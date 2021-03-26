import {
  Component,
  Input,
} from '@angular/core';
import { Candidate, TestSlot } from '@dvsa/mes-journal-schema';
import { isEqual } from 'lodash';
import { Examiner, TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';
import { CandidateTestSlot } from '../../models/candidate-test-slot';

type CandidateData = {
  name: string,
  slot: TestSlot,
};

@Component({
  selector: 'candidate-search-card',
  templateUrl: 'candidate-search-card.html',
  styleUrls: ['candidate-search-card.scss'],
})
export class CandidateSearchCardComponent {

  @Input() testCentreResults: TestCentreDetailResponse;

  today: Date = new Date();
  tomorrow: Date;
  candidateTestSlots: CandidateTestSlot[] = [];
  todaySlots: CandidateTestSlot[];
  tomorrowSlots: CandidateTestSlot[];
  shouldShowCandidateResults: boolean;
  selectedCandidateName: string;
  enableShowBookingButton: boolean = false;

  getCandidateList = (): CandidateData[] => {
    if (!this.testCentreResults) {
      return null;
    }
    const extractedData: CandidateData[] = [];

    this.testCentreResults.examiners.forEach((examiner) => {
      examiner.journal?.testSlots.forEach((testSlot) => {
        const { candidate } = testSlot.booking;
        extractedData.push({
          name: `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`,
          slot: testSlot,
        });
      });
    });

    return extractedData;
  };

  ngOnChanges() {
    if (this.testCentreResults && this.testCentreResults.examiners) {
      this.createCandidateSlots(this.testCentreResults.examiners, this.selectedCandidateName);
    }
  }

  createCandidateSlots(examinersData: Examiner[], candidateName: string): void {
    this.candidateTestSlots = [];
    examinersData.forEach((examiner) => {
      if (examiner.journal && examiner.journal.testSlots && examiner.journal.testSlots.length > 0) {
        examiner.journal.testSlots.forEach((testSlot) => {
          if (this.getCandidateName(testSlot.booking.candidate) === candidateName) {
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
    this.tomorrow = new Date(this.today.getTime() + (24 * 60 * 60 * 1000));
    this.todaySlots = this.candidateTestSlots.filter((candidateTestSlot) => {
      return isEqual(candidateTestSlot.slot.slotDetail.start.substr(0, 10), this.today.toISOString().substr(0, 10));
    });
    this.tomorrowSlots = this.candidateTestSlots.filter((candidateTestSlot) => {
      return isEqual(candidateTestSlot.slot.slotDetail.start.substr(0, 10), this.tomorrow.toISOString().substr(0, 10));
    });
  }

  getCandidateName = (candidate: Candidate): string =>
    `${candidate.candidateName.firstName} ${candidate.candidateName.lastName}`;

  onCandidateDidChange(candidate: any): void {
    this.shouldShowCandidateResults = false;
    const isValidCandidate: boolean = !!(candidate && candidate.name);
    this.enableShowBookingButton = isValidCandidate;
    if (isValidCandidate) {
      this.selectedCandidateName = candidate.name;
      this.createCandidateSlots(this.testCentreResults.examiners, this.selectedCandidateName);
      this.selectedCandidateName = candidate.name;
    }
  }

  showResults(): void {
    this.shouldShowCandidateResults = true;
  }

}
