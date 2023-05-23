import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash';
import { TestDetailsModel } from './test-details-card.model';

export type CandidateDetails = { prn: number; attemptNumber: number; };

@Component({
  selector: 'test-details-card',
  templateUrl: 'test-details-card.html',
  styleUrls: ['test-details-card.scss'],
})
export class TestDetailsCardComponent {

  @Input()
  data: TestDetailsModel;

  @Input()
  zoom: string;

  @Input()
  candidateDetails: CandidateDetails;

  specialNeedsIsPopulated(specialNeedsArray: string[]): boolean {
    return specialNeedsArray.length > 0 && specialNeedsArray[0] !== 'None';
  }

  showFullCatHeld(): boolean {
    return [TestCategory.CE, TestCategory.C1E, TestCategory.DE, TestCategory.D1E].includes(this.data.category);
  }

  showAttemptNumber(): boolean {
    return get(this.candidateDetails, 'attemptNumber', null) !== null
        || typeof get(this.candidateDetails, 'attemptNumber') !== 'undefined';
  }

  showPrn(): boolean {
    return get(this.candidateDetails, 'prn', null) !== null
        || typeof get(this.candidateDetails, 'prn') !== 'undefined';
  }

}
