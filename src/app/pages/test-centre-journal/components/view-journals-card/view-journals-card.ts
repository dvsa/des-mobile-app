import {
  Component, EventEmitter,
  Input, OnChanges, Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Examiner, ExaminerWorkSchedule, TestCentre } from '@dvsa/mes-journal-schema';
import { first, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { IonSelect } from '@ionic/angular';

import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProvider } from '@providers/slot/slot';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from '@store/journal/journal.model';
import {
  SearchablePicklistComponentWrapper,
} from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import {
  TestCentreJournalDateNavigation,
  TestCentreJournalSelectExaminer,
  TestCentreJournalShowJournals,
} from '@pages/test-centre-journal/test-centre-journal.actions';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';

export enum Day {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
}

@Component({
  selector: 'view-journals-card',
  templateUrl: 'view-journals-card.html',
  styleUrls: ['./view-journals-card.scss'],
})
export class ViewJournalsCardComponent implements OnChanges {

  @ViewChild('slotContainer', { read: ViewContainerRef })
  slotContainer: ViewContainerRef;

  @ViewChild('examinerSelect')
  examinerSelect: IonSelect;

  @ViewChild('testCentrePicklistJournals')
  testCentreTypeAheadDropDown: SearchablePicklistComponentWrapper<TestCentre>;

  @Input()
  testCentreResults: TestCentreDetailResponse;

  @Input()
  testCentreName: string;

  @Input()
  manuallyRefreshed: boolean;

  @Input()
  isLDTM: boolean = false;

  @Input()
  testCentres: TestCentre[] = [];

  @Input()
  selectedTestCentre: TestCentre;

  @Output()
  testCentreChanged = new EventEmitter<TestCentre>();

  hasSelectedExaminer: boolean = false;
  hasClickedShowJournal: boolean = false;
  journal: ExaminerWorkSchedule | null = null;
  examinerName: string = null;
  examinerSlotItemsByDate: ExaminerSlotItemsByDate;
  completedTests: SearchResultTestSchema[];
  private dateFormat = 'YYYY-MM-DD';
  today: string = new DateTime().format(this.dateFormat);
  currentSelectedDate: string = this.today;
  slotItems$: Observable<SlotItem[]>;

  constructor(
    private slotProvider: SlotProvider,
    private slotSelectorProvider: SlotSelectorProvider,
    private store$: Store<StoreModel>,
  ) {
  }

  ngOnChanges(): void {
    if (this.manuallyRefreshed) {
      this.onManualRefresh();
    }
  }

  get interfaceOptions() {
    return {
      cssClass: 'mes-select',
      backdropDismiss: false,
      placeholder: 'Select examiner',
      okText: 'Select',
      cancelText: 'Cancel',
    };
  }

  onManualRefresh = (): void => {
    this.journal = null;
    this.examinerName = null;
    this.hasSelectedExaminer = false;
    this.hasClickedShowJournal = false;
    if (this.examinerSelect) {
      this.examinerSelect.value = null;
    }
    this.slotContainer?.clear();
  };

  examinerChanged = (staffNumber: string): void => {
    if (!staffNumber) return;

    this.store$.dispatch(TestCentreJournalSelectExaminer());

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
      console.log('not journal');
      // if no journal, then don't try to pass value into slot creation method
      return;
    }

    this.store$.dispatch(TestCentreJournalShowJournals());

    // createSlots with the selected journal
    this.slotItems$ = of(this.journal)
      .pipe(
        first(), // auto unsubscribe after first emission
        map((journalData: ExaminerWorkSchedule): ExaminerSlotItems => ({
          examiner: journalData.examiner as Required<Examiner>,
          slotItems: this.slotProvider.detectSlotChanges({}, journalData),
        })),
        map((examinerSlotItems: ExaminerSlotItems): ExaminerSlotItemsByDate => ({
          examiner: examinerSlotItems.examiner,
          slotItemsByDate: this.slotProvider.getRelevantSlotItemsByDate(examinerSlotItems.slotItems),
        })),
        map((examinerSlotItemsByDate: ExaminerSlotItemsByDate) => {
          this.examinerSlotItemsByDate = examinerSlotItemsByDate;
          return examinerSlotItemsByDate?.slotItemsByDate[this.currentSelectedDate];
        }),
      );
  };

  canNavigateToNextDay = (): boolean => {
    const nextDay = DateTime.at(this.currentSelectedDate).add(1, Duration.DAY).format(this.dateFormat);
    const today = DateTime.at(this.today);
    const isInRange = DateTime.at(this.currentSelectedDate).daysDiff(today) === 0;
    return (this.examinerSlotItemsByDate?.slotItemsByDate[nextDay]?.length > 0 || isInRange);
  };

  canNavigateToPreviousDay = (): boolean => {
    const dayBefore = DateTime.at(this.currentSelectedDate).subtract(1, Duration.DAY).format(this.dateFormat);
    return this.examinerSlotItemsByDate?.slotItemsByDate[dayBefore]?.length > 0
      || this.currentSelectedDate > this.today;
  };

  isSelectedDateToday = (): boolean => this.currentSelectedDate === this.today;

  onPreviousDayClick = (): void => {
    this.store$.dispatch(TestCentreJournalDateNavigation(Day.TODAY));
    this.currentSelectedDate = this.today;
    this.onShowJournalClick();
  };

  onNextDayClick = (): void => {
    this.store$.dispatch(TestCentreJournalDateNavigation(Day.TOMORROW));
    this.currentSelectedDate = new DateTime().add(1, Duration.DAY).format(this.dateFormat);
    this.onShowJournalClick();
  };

  shouldShowBanner = (): boolean => {
    return this.examinerName && this.examinerSlotItemsByDate?.slotItemsByDate[this.currentSelectedDate]?.length === 0;
  };

  onTestCentreDidChange(testCentre: TestCentre): void {
    if (testCentre) {
      this.onManualRefresh();
      this.testCentreChanged.emit(testCentre);
    }
  }

  get dayLabel(): string {
    return this.isSelectedDateToday() ? Day.TODAY : Day.TOMORROW;
  }

  get warningText(): string {
    const message = 'does not have any test bookings at';
    return `${this.examinerName} ${message} ${this.testCentreName.replace(/,/g, '/')} ${this.dayLabel}`;
  }
}
