import { Component, EventEmitter, Output } from '@angular/core';
import { JOURNAL_PAGE } from '../../../page-names.constants';

@Component({
  selector: 'go-to-journal-card',
  templateUrl: 'go-to-journal-card.html',
  styleUrls: ['go-to-journal-card.scss'],
})

export class GoToJournalCardComponent {
  @Output()
  navigateClicked = new EventEmitter<string>();

  navigateToJournal = () => {
    this.navigateClicked.emit(JOURNAL_PAGE);
  };
}
