import { Component, Input } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';

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

}
