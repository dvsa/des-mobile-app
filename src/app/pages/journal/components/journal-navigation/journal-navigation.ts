import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'journal-navigation',
  templateUrl: 'journal-navigation.html',
  styleUrls: ['journal-navigation.scss'],
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonText, DatePipe],
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
