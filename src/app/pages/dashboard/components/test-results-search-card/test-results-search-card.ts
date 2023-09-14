import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TEST_RESULTS_SEARCH_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'test-results-search-card',
  templateUrl: 'test-results-search-card.html',
  styleUrls: ['test-results-search-card.scss'],
})
export class TestResultsSearchCardComponent {

  @Input()
  state: OfflineBannerComponent;

  @Output()
  navigate = new EventEmitter<string>();

  navigateToTestResultsSearch = async () => {
    this.navigate.emit(TEST_RESULTS_SEARCH_PAGE);
  };

}
