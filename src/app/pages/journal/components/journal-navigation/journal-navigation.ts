import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'journal-navigation',
  templateUrl: 'journal-navigation.html',
  styleUrls: ['journal-navigation.scss'],
})
export class JournalNavigationComponent {

  @Input()
  fromTestCentreJournal: boolean = false;

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

  get nextDayLabel(): string {
    return this.fromTestCentreJournal ? 'Tomorrow' : 'Next day';
  }

  get previousDayLabel(): string {
    return this.fromTestCentreJournal ? 'Today' : 'Previous day';
  }
}
