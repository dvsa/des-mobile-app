import { Component, Input } from '@angular/core';
import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';

@Component({
  selector: 'candidate-search-card',
  templateUrl: 'candidate-search-card.html',
  styleUrls: ['candidate-search-card.scss'],
})
export class CandidateSearchCardComponent {

  @Input() testCentreResults: TestCentreDetailResponse;

}
