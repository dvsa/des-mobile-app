import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JOURNAL_PAGE } from '../../../page-names.constants';

@Component({
  selector: 'go-to-journal-card',
  templateUrl: 'go-to-journal-card.html',
  styleUrls: ['go-to-journal-card.scss'],
})

export class GoToJournalCardComponent {

  constructor(private router: Router) { }

  navigateToJournal = () => {
    this.router.navigate([JOURNAL_PAGE]);
  };
}
