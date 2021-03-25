import {
  Component, ComponentFactoryResolver,
  Input, ViewChild, ViewContainerRef,
} from '@angular/core';
import { Examiner, ExaminerWorkSchedule, TestSlot } from '@dvsa/mes-journal-schema';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { groupBy, isEmpty } from 'lodash';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import moment from 'moment';
import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from '../../../../../store/journal/journal.model';
import { SlotItem } from '../../../../providers/slot-selector/slot-item';
import { SlotProvider } from '../../../../providers/slot/slot';
import { SlotComponent } from '../../../../../components/test-slot/slot/slot';
import { PersonalCommitmentSlotComponent } from '../../../journal/components/personal-commitment/personal-commitment';
import { TestSlotComponent } from '../../../../../components/test-slot/test-slot/test-slot';
import { TestStatus } from '../../../../../store/tests/test-status/test-status.model';
import { formatApplicationReference } from '../../../../shared/helpers/formatters';
import { SlotSelectorProvider } from '../../../../providers/slot-selector/slot-selector';
import { DateTimeProvider } from '../../../../providers/date-time/date-time';

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
  private today = moment().format('YYYY-MM-DD');
  private yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  currentSelectedDate: string = this.today;

  constructor(
    private slotProvider: SlotProvider,
    private slotSelector: SlotSelectorProvider,
    private resolver: ComponentFactoryResolver,
    private dateTimeProvider: DateTimeProvider,
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
    console.log(this.journal);
    this.hasSelectedExaminer = true;
    this.hasClickedShowJournal = false;
    this.slotContainer?.clear();
  };

  onShowJournalClick = (): void => {
    // this.currentSelectedDate = this.today;
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
          slotItemsByDate: this.getRelevantSlotItemsByDate(examinerSlotItems.slotItems),
        })),
        map((slotItemsByDate: ExaminerSlotItemsByDate) => {
          this.examinerSlotItemsByDate = slotItemsByDate;
        }),
      ).subscribe();

    const slots: SlotItem[] | undefined = this.examinerSlotItemsByDate?.slotItemsByDate[this.currentSelectedDate];
    this.createSlots(slots);
  };

  private createSlots = (emission: SlotItem[]) => {
    // Clear any dynamically created slots before adding the latest
    this.slotContainer.clear();

    if (!Array.isArray(emission)) return;

    if (emission.length === 0) return;

    const slots = this.slotSelector.getSlotTypes(emission);

    let lastLocation;
    // eslint-disable-next-line no-restricted-syntax
    for (const slot of slots) {
      const factory = this.resolver.resolveComponentFactory(slot.component);
      const componentRef = this.slotContainer.createComponent(factory);

      (<SlotComponent>componentRef.instance).slot = slot.slotData;
      (<SlotComponent>componentRef.instance).hasSlotChanged = slot.hasSlotChanged;
      (<SlotComponent>componentRef.instance).showLocation = (slot.slotData.testCentre.centreName !== lastLocation);
      lastLocation = slot.slotData.testCentre.centreName;

      if (componentRef.instance instanceof PersonalCommitmentSlotComponent) {
        // if this is a personal commitment assign it to the component
        (<PersonalCommitmentSlotComponent>componentRef.instance).personalCommitments = slot.personalCommitment;
      }

      if (componentRef.instance instanceof TestSlotComponent) {
        const activityCode = this.hasSlotBeenTested(slot.slotData as TestSlot);

        if (activityCode) {
          (<TestSlotComponent>componentRef.instance).derivedActivityCode = activityCode;
          (<TestSlotComponent>componentRef.instance).derivedTestStatus = TestStatus.Submitted;
        }

        // if this is a test slot assign hasSeenCandidateDetails separately
        (<TestSlotComponent>componentRef.instance).hasSeenCandidateDetails = slot.hasSeenCandidateDetails;
      }
    }
  };

  hasSlotBeenTested(slotData: TestSlot): ActivityCode | null {
    if (isEmpty(this.completedTests)) {
      return null;
    }

    const applicationReference: ApplicationReference = {
      applicationId: slotData.booking.application.applicationId,
      bookingSequence: slotData.booking.application.bookingSequence,
      checkDigit: slotData.booking.application.checkDigit,
    };

    const completedTest = this.completedTests.find((compTest) => {
      return compTest.applicationReference === parseInt(formatApplicationReference(applicationReference), 10);
    });

    return completedTest ? completedTest.activityCode : null;
  }

  private getRelevantSlotItemsByDate = (slotItems: SlotItem[]): { [date: string]: SlotItem[] } => {
    let slotItemsByDate: { [date: string]: SlotItem[] };
    slotItemsByDate = groupBy(slotItems, this.slotProvider.getSlotDate);
    slotItemsByDate = this.slotProvider.extendWithEmptyDays(slotItemsByDate);
    slotItemsByDate = this.slotProvider.getRelevantSlots(slotItemsByDate);
    return slotItemsByDate;
  };

  canNavigateToNextDay = (): boolean => {
    const tomorrow = moment(this.currentSelectedDate).add(1, 'day').format('YYYY-MM-DD');
    return this.examinerSlotItemsByDate?.slotItemsByDate[tomorrow]?.length > 0;
  };

  canNavigateToPreviousDay = (): boolean => {
    const yesterday = moment(this.currentSelectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    return this.examinerSlotItemsByDate?.slotItemsByDate[yesterday]?.length > 0;
  };

  isSelectedDateToday = (): boolean => this.currentSelectedDate === this.today;

  onPreviousDayClick = (): void => {
    this.currentSelectedDate = this.today;
    console.log('currentSelectedDate ', this.currentSelectedDate);
    this.onShowJournalClick();
  };

  onNextDayClick = (): void => {
    this.currentSelectedDate = moment().add(1, 'day').format('YYYY-MM-DD');
    console.log('currentSelectedDate ', this.currentSelectedDate);
    this.onShowJournalClick();
  };
}
