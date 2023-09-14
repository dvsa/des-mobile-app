import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JOURNAL_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'go-to-journal-card',
  templateUrl: 'go-to-journal-card.html',
  styleUrls: ['go-to-journal-card.scss'],
})
export class GoToJournalCardComponent {

  constructor(private router: Router) {
  }

  navigateToJournal = async () => {
    await this.router.navigate([JOURNAL_PAGE], { replaceUrl: true });
  };
}
