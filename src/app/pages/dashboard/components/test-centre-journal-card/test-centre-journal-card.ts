import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TEST_CENTRE_JOURNAL_PAGE } from '@pages/page-names.constants';

@Component({
    selector: 'test-centre-journal-card',
    templateUrl: 'test-centre-journal-card.html',
    styleUrls: ['test-centre-journal-card.scss'],
    standalone: false
})
export class TestCentreJournalCardComponent {
  @Output() navigatedToTestCentreJournal = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateToTestCentreJournal = async () => {
    this.navigatedToTestCentreJournal.emit();
    await this.router.navigate([TEST_CENTRE_JOURNAL_PAGE]);
  };
}
