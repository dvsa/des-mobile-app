import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TEST_RESULTS_SEARCH_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'test-results-search-card',
  templateUrl: 'test-results-search-card.html',
  styleUrls: ['test-results-search-card.scss'],
  imports: [IonButton, IonGrid, IonRow, NgOptimizedImage, IonText],
})
export class TestResultsSearchCardComponent {
  constructor(private router: Router) {}

  navigateToTestResultsSearch = async () => {
    await this.router.navigate([TEST_RESULTS_SEARCH_PAGE]);
  };
}
