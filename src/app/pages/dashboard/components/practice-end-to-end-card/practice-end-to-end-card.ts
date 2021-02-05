import { Component } from '@angular/core';
import { Router } from '@angular/router';
// TODO: reinstate when shifting end-to-end practice mode
// import { FAKE_JOURNAL_PAGE } from '../../../page-names.constants';

@Component({
  selector: 'practice-end-to-end-card',
  templateUrl: 'practice-end-to-end-card.html',
  styleUrls: ['practice-end-to-end-card.scss'],
})

export class PracticeEndToEndCardComponent {

  constructor(private router: Router) { }

  navigateToFakeJournal = () => {
    console.log('Practice end to end test to be implemented');
    // this.router.navigate([FAKE_JOURNAL_PAGE]);
  };

}
