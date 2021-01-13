import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TEST_RESULTS_SEARCH_PAGE } from '../../../page-names.constants';

@Component({
  selector: 'test-results-search-card',
  templateUrl: 'test-results-search-card.html',
  styleUrls: ['test-results-search-card.scss'],
})

export class TestResultsSearchCardComponent {

  constructor(private router: Router) { }

  navigateToTestResultsSearch = () => {
    this.router.navigate([TEST_RESULTS_SEARCH_PAGE]);
  };

}
