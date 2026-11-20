import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Examiner, ExaminerWorkSchedule, TestCentre } from '@dvsa/mes-journal-schema';
import { IonButton, IonCol, IonRow, IonSelect, IonSelectOption, IonText } from '@ionic/angular';

import { SearchablePicklistComponentWrapper } from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { Store } from '@ngrx/store';
import { JournalNavigationComponent } from '@pages/journal/components/journal-navigation/journal-navigation';
import { JournalSlotComponent } from '@pages/journal/components/journal-slot/journal-slot';
import {
  TestCentreJournalDateNavigation,
  TestCentreJournalSelectExaminer,
  TestCentreJournalShowJournals,
} from '@pages/test-centre-journal/test-centre-journal.actions';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { transformStringForID } from '@shared/helpers/transform-string-for-id';
import { StoreModel } from '@shared/models/store.model';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from '@store/journal/journal.model';
import { get } from 'lodash-es';
import { SearchablePicklistComponentWrapper as SearchablePicklistComponentWrapper_1 } from '../../../../../components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { TestCentreNameComponent } from '../test-centre-name/test-centre-name';

export enum Day {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
}

@Component({
  selector: 'view-journals-card',
  templateUrl: 'view-journals-card.html',
  styleUrls: ['./view-journals-card.scss'],
  imports: [
    SearchablePicklistComponentWrapper_1,
    TestCentreNameComponent,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText,
    JournalNavigationComponent,
    JournalSlotComponent,
  ],
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
  isLDTM = false;

  @Input()
  testCentres: TestCentre[] = [];

  @Input()
  selectedTestCentre: TestCentre;

  @Output()
  testCentreChanged = new EventEmitter<TestCentre>();

  hasSelectedExaminer = signal(false);
  hasClickedShowJournal = signal(false);
  journal = signal<ExaminerWorkSchedule>(null);
  examinerName = signal<string>(null);
  examinerSlotItemsByDate = signal<ExaminerSlotItemsByDate>(null);
  private dateFormat = 'YYYY-MM-DD';
  today: string = new DateTime().format(this.dateFormat);
  currentSelectedDate = signal(this.today);
  slotItems = signal<SlotItem[]>([]);
  readonly isPortrait = toSignal(this.orientationMonitorProvider.isPortraitMode$, { initialValue: false });
  protected readonly transformStringForID = transformStringForID;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private slotProvider: SlotProvider,
    private slotSelectorProvider: SlotSelectorProvider,
    private store$: Store<StoreModel>
  ) {}

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
    this.journal.set(null);
    this.examinerName.set(null);
    this.hasSelectedExaminer.set(false);
    this.hasClickedShowJournal.set(false);
    this.examinerSlotItemsByDate.set(null);
    this.slotItems.set([]);
    if (this.examinerSelect) {
      this.examinerSelect.value = null;
    }
    this.slotContainer?.clear();
  };

  examinerChanged = (staffNumber: string): void => {
    if (!staffNumber) return;

    this.store$.dispatch(TestCentreJournalSelectExaminer());

    const examiners: Examiner[] = get(this.testCentreResults, 'examiners', []);

    if (examiners.length === 0) {
      // if no examiners, then don't try to find examiner details
      return;
    }

    const { journal, name } = this.testCentreResults.examiners.find((examiner) => examiner.staffNumber === staffNumber);
    this.currentSelectedDate.set(this.today);
    this.journal.set(journal);
    this.examinerName.set(name);
    this.hasSelectedExaminer.set(true);
    this.hasClickedShowJournal.set(false);
    this.examinerSlotItemsByDate.set(null);
    this.slotItems.set([]);
    this.slotContainer?.clear();
  };

  onShowJournalClick = (): void => {
    this.hasClickedShowJournal.set(true);

    const journal = this.journal();
    if (!journal) {
      // if no journal, then don't try to pass value into slot creation method
      return;
    }

    this.store$.dispatch(TestCentreJournalShowJournals());

    const examinerSlotItems: ExaminerSlotItems = {
      examiner: journal.examiner as Required<Examiner>,
      slotItems: this.slotProvider.detectSlotChanges({}, journal),
    };
    const examinerSlotItemsByDate: ExaminerSlotItemsByDate = {
      examiner: examinerSlotItems.examiner,
      slotItemsByDate: this.slotProvider.getRelevantSlotItemsByDate(examinerSlotItems.slotItems),
    };
    this.examinerSlotItemsByDate.set(examinerSlotItemsByDate);
    this.slotItems.set(examinerSlotItemsByDate.slotItemsByDate[this.currentSelectedDate()] ?? []);
  };

  canNavigateToNextDay = (): boolean => {
    const nextDay = DateTime.at(this.currentSelectedDate()).add(1, Duration.DAY).format(this.dateFormat);
    const today = DateTime.at(this.today);
    const isInRange = DateTime.at(this.currentSelectedDate()).daysDiff(today) === 0;
    return this.examinerSlotItemsByDate()?.slotItemsByDate[nextDay]?.length > 0 || isInRange;
  };

  canNavigateToPreviousDay = (): boolean => {
    const dayBefore = DateTime.at(this.currentSelectedDate()).subtract(1, Duration.DAY).format(this.dateFormat);
    return (
      this.examinerSlotItemsByDate()?.slotItemsByDate[dayBefore]?.length > 0 || this.currentSelectedDate() > this.today
    );
  };

  isSelectedDateToday = (): boolean => this.currentSelectedDate() === this.today;

  onPreviousDayClick = (): void => {
    this.store$.dispatch(TestCentreJournalDateNavigation(Day.TODAY));
    this.currentSelectedDate.set(this.today);
    this.onShowJournalClick();
  };

  onNextDayClick = (): void => {
    this.store$.dispatch(TestCentreJournalDateNavigation(Day.TOMORROW));
    this.currentSelectedDate.set(new DateTime().add(1, Duration.DAY).format(this.dateFormat));
    this.onShowJournalClick();
  };

  shouldShowBanner = (): boolean => {
    return (
      this.examinerName() && this.examinerSlotItemsByDate()?.slotItemsByDate[this.currentSelectedDate()]?.length === 0
    );
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
    return `${this.examinerName()} ${message} ${this.testCentreName.replace(/,/g, '/')} ${this.dayLabel}`;
  }
}
