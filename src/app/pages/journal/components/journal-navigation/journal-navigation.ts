import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'journal-navigation',
  templateUrl: 'journal-navigation.html',
  styleUrls: ['journal-navigation.scss'],
  standalone: false,
})
export class JournalNavigationComponent {
  @Input()
  fromTestCentreJournal = false;

  @Input()
  canNavigateToPreviousDay: boolean;

  @Input()
  canNavigateToNextDay: boolean;

  @Input()
  isSelectedDateToday: boolean;

  @Input()
  selectedDate: string;

  @Output()
  previousDayClicked = new EventEmitter();

  @Output()
  nextDayClicked = new EventEmitter();

  onPreviousDayClick(): void {
    this.previousDayClicked.emit();
  }

  onNextDayClick(): void {
    this.nextDayClicked.emit();
  }
}
