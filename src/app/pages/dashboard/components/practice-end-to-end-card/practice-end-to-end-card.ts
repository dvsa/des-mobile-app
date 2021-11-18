import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';

@Component({
  selector: 'practice-end-to-end-card',
  templateUrl: 'practice-end-to-end-card.html',
  styleUrls: ['practice-end-to-end-card.scss'],
})

export class PracticeEndToEndCardComponent {

  constructor(private router: Router) { }

  navigateToFakeJournal = () => {
    this.router.navigate([FAKE_JOURNAL_PAGE]);
  };

}
