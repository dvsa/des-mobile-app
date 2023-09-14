import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TEST_CENTRE_JOURNAL_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'test-centre-journal-card',
  templateUrl: 'test-centre-journal-card.html',
  styleUrls: ['test-centre-journal-card.scss'],
})
export class TestCentreJournalCardComponent {

  constructor(private router: Router) {}

  navigateToTestCentreJournal = async () => {
    await this.router.navigate([TEST_CENTRE_JOURNAL_PAGE], { replaceUrl: true });
  };

}
