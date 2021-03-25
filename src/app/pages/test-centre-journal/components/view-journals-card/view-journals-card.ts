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

import { TestCentre, TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';
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
  examinerName: string = null;
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

  get testCentreNames(): string {
    return this.testCentreResults?.testCentres?.map((testCentre: TestCentre) => testCentre.name).join(', ');
  }

  examinerChanged = (staffNumber: string): void => {
    const {
      journal,
      name,
    } = this.testCentreResults?.examiners.find((examiner) => examiner.staffNumber === staffNumber);
    this.currentSelectedDate = this.today;
    this.journal = journal;
    this.examinerName = name;
    this.hasSelectedExaminer = true;
    this.hasClickedShowJournal = false;
    this.slotContainer?.clear();
  };

  onShowJournalClick = (): void => {
    this.hasClickedShowJournal = true;
    if (!this.journal) {
      // if no journal, then dont try to pass value into slot creation method
      return;
    }
    // createSlots with the selected journal
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
    const nextDay = DateTime.at(this.currentSelectedDate).add(1, Duration.DAY).format(this.dateFormat);
    const today = DateTime.at(this.today);
    const isInRange = DateTime.at(this.currentSelectedDate).daysDiff(today) === 0;
    return (this.examinerSlotItemsByDate?.slotItemsByDate[nextDay]?.length > 0 || isInRange);
  };

  canNavigateToPreviousDay = (): boolean => {
    const dayBefore = DateTime.at(this.currentSelectedDate).subtract(1, Duration.DAY).format(this.dateFormat);
    return this.examinerSlotItemsByDate?.slotItemsByDate[dayBefore]?.length > 0;
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

  shouldShowBanner = (): boolean => {
    return this.examinerName && this.examinerSlotItemsByDate?.slotItemsByDate[this.currentSelectedDate]?.length === 0;
  };

  get dayLabel(): string {
    return this.isSelectedDateToday() ? 'today' : 'tomorrow';
  }

  get warningText(): string {
    return `${this.examinerName} is not working at ${this.testCentreNames} ${this.dayLabel}`;
  }
}
