import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Examiner, ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';

import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from '../../../../../store/journal/journal.model';
import { SlotItem } from '../../../../providers/slot-selector/slot-item';
import { SlotProvider } from '../../../../providers/slot/slot';
import { SlotSelectorProvider } from '../../../../providers/slot-selector/slot-selector';
import { DateTime, Duration } from '../../../../shared/helpers/date-time';

@Component({
  selector: 'view-journals-card',
  templateUrl: 'view-journals-card.html',
  styleUrls: ['./view-journals-card.scss'],
})
export class ViewJournalsCardComponent {

  @ViewChild('slotContainer', { read: ViewContainerRef }) slotContainer;

  @Input()
  testCentreResults: TestCentreDetailResponse;

  hasSelectedExaminer: boolean = false;
  hasClickedShowJournal: boolean = false;
  journal: ExaminerWorkSchedule | null = null;
  examinerSlotItemsByDate: ExaminerSlotItemsByDate;
  completedTests: SearchResultTestSchema[];
  private dateFormat = 'YYYY-MM-DD';
  private today = new DateTime().format(this.dateFormat);
  currentSelectedDate: string = this.today;

  constructor(
    private slotProvider: SlotProvider,
    private slotSelectorProvider: SlotSelectorProvider,
  ) {
  }

  get interfaceOptions() {
    return {
      cssClass: 'mes-select',
      enableBackdropDismiss: false,
      placeholder: 'Select examiner',
      okText: 'Select',
      cancelText: 'Cancel',
    };
  }

  examinerChanged = (staffNumber: string): void => {
    const { journal } = this.testCentreResults?.examiners.find((examiner) => examiner.staffNumber === staffNumber);
    this.currentSelectedDate = this.today;
    this.journal = journal;
    this.hasSelectedExaminer = true;
    this.hasClickedShowJournal = false;
    this.slotContainer?.clear();
  };

  onShowJournalClick = (): void => {
    if (!this.journal) {
      return;
    }
    this.hasClickedShowJournal = true;
    // createSlots with this.journal
    of(this.journal)
      .pipe(
        map((journalData: ExaminerWorkSchedule): ExaminerSlotItems => ({
          examiner: journalData.examiner as Required<Examiner>,
          slotItems: this.slotProvider.detectSlotChanges({}, journalData),
        })),
        map((examinerSlotItems: ExaminerSlotItems): ExaminerSlotItemsByDate => ({
          examiner: examinerSlotItems.examiner,
          slotItemsByDate: this.slotProvider.getRelevantSlotItemsByDate(examinerSlotItems.slotItems),
        })),
        tap((examinerSlotItemsByDate: ExaminerSlotItemsByDate) => {
          this.examinerSlotItemsByDate = examinerSlotItemsByDate;
          const slots: SlotItem[] | undefined = examinerSlotItemsByDate?.slotItemsByDate[this.currentSelectedDate];
          this.createSlots(slots);
        }),
      ).subscribe();
  };

  private createSlots = (emission: SlotItem[]): void => {
    this.slotSelectorProvider.createSlots(this.slotContainer, emission, this.completedTests, true);
  };

  canNavigateToNextDay = (): boolean => {
    const tomorrow = DateTime.at(this.currentSelectedDate).add(1, Duration.DAY).format(this.dateFormat);
    return this.examinerSlotItemsByDate?.slotItemsByDate[tomorrow]?.length > 0;
  };

  canNavigateToPreviousDay = (): boolean => {
    const yesterday = DateTime.at(this.currentSelectedDate).subtract(1, Duration.DAY).format(this.dateFormat);
    return this.examinerSlotItemsByDate?.slotItemsByDate[yesterday]?.length > 0;
  };

  isSelectedDateToday = (): boolean => this.currentSelectedDate === this.today;

  onPreviousDayClick = (): void => {
    this.currentSelectedDate = this.today;
    this.onShowJournalClick();
  };

  onNextDayClick = (): void => {
    this.currentSelectedDate = new DateTime().add(1, Duration.DAY).format(this.dateFormat);
    this.onShowJournalClick();
  };
}
