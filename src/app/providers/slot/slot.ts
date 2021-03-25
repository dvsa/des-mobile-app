import { Injectable } from '@angular/core';
import { DeepDiff } from 'deep-diff';
import {
  flatten, times, isEmpty, get, groupBy,
} from 'lodash';
import { Store } from '@ngrx/store';
import { ExaminerWorkSchedule, PersonalCommitment, TestSlot } from '@dvsa/mes-journal-schema';
import { StoreModel } from '../../shared/models/store.model';
import { SlotItem } from '../slot-selector/slot-item';
import { AppConfigProvider } from '../app-config/app-config';
import { DateTime, Duration } from '../../shared/helpers/date-time';
import { SlotHasChanged } from './slot.actions';
import { DateTimeProvider } from '../date-time/date-time';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

const MS_PER_DAY: number = 1000 * 60 * 60 * 24;

@Injectable()
export class SlotProvider {

  constructor(
    private store$: Store<StoreModel>,
    public appConfigProvider: AppConfigProvider,
    private dateTimeProvider: DateTimeProvider,
  ) {
  }

  detectSlotChanges(slots: { [k: string]: SlotItem[] }, newJournal: ExaminerWorkSchedule): SlotItem[] {
    const newSlots = flatten([
      newJournal.testSlots || [],
      newJournal.nonTestActivities || [],
    ]);

    const oldJournalSlots: SlotItem[] = flatten(Object.values(slots));

    newSlots.sort((slotA, slotB) => (slotA.slotDetail.start < slotB.slotDetail.start ? -1 : 1));

    return newSlots.map((newSlot) => {
      const newSlotId = newSlot.slotDetail.slotId;

      const replacedJournalSlot = oldJournalSlots.find((oldSlot) => oldSlot.slotData.slotDetail.slotId === newSlotId);

      let differenceFound = false;
      let hasSeenCandidateDetails = false;
      if (replacedJournalSlot) {
        differenceFound = replacedJournalSlot.hasSlotChanged;
        hasSeenCandidateDetails = replacedJournalSlot.hasSeenCandidateDetails;
        const differenceToSlot = DeepDiff(replacedJournalSlot.slotData, newSlot);
        if (Array.isArray(differenceToSlot) && differenceToSlot.some((change) => change.kind === 'E')) {
          this.store$.dispatch(new SlotHasChanged(newSlotId));
          differenceFound = true;
        }
      }

      let personalCommitment: PersonalCommitment[] = null;
      if (!isEmpty(newJournal.personalCommitments)) {
        personalCommitment = newJournal.personalCommitments.filter(
          (commitment) => Number(commitment.slotId) === Number(newSlotId),
        );
      }

      // add personalCommitment information to SlotItem, component and activityCode set to null
      // as they are not constructed at this stage.
      return new SlotItem(newSlot, differenceFound, hasSeenCandidateDetails, null, null, personalCommitment);
    });
  }

  /**
   * Extends the journal with empty days where there was no slots defined in the next 7 days
   * @param slots Journal slots
   * @returns Slots with additional empty days
   */
  extendWithEmptyDays = (slots: { [k: string]: SlotItem[] }): { [k: string]: SlotItem[] } => {
    const { numberOfDaysToView } = this.appConfigProvider.getAppConfig().journal;

    const days = times(
      numberOfDaysToView,
      (d: number): string => this.dateTimeProvider.now().add(d, Duration.DAY).format('YYYY-MM-DD'),
    );
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const emptyDays = days.reduce((days: { [k: string]: SlotItem[] }, day: string) => ({ ...days, [day]: [] }), {});

    return {
      ...emptyDays,
      ...slots,
    };
  };

  /**
   * @param slots Journal slots
   * @returns Only the relevant slots
   */
  getRelevantSlots = (slots: { [k: string]: SlotItem[] }): { [k: string]: SlotItem[] } => {
    return Object.keys(slots)
      .reduce(
        (acc: { [k: string]: SlotItem[] }, date) => ({
          ...acc,
          [date]: slots[date],
        }),
        {},
      );
  };

  getSlotDate = (slot: SlotItem): string => DateTime.at(slot.slotData.slotDetail.start).format('YYYY-MM-DD');

  canStartTest(testSlot: TestSlot): boolean {
    const { testPermissionPeriods } = this.appConfigProvider.getAppConfig().journal;
    const testCategory = get(testSlot, 'booking.application.testCategory');
    const startDate = new DateTime(testSlot.slotDetail.start);
    const slotStartDate: Date = new Date(testSlot.slotDetail.start);

    if (!testCategory || startDate.daysDiff(this.dateTimeProvider.now()) < 0) {
      return false;
    }

    const periodsPermittingStart = testPermissionPeriods.filter((period) => {
      const slotHasPeriodStartCriteria: boolean = this.hasPeriodStartCriteria(slotStartDate, period.from);
      const slotHasPeriodEndCriteria: boolean = this.hasPeriodEndCriteria(slotStartDate, period.to);
      return period.testCategory === testCategory && slotHasPeriodStartCriteria && slotHasPeriodEndCriteria;
    });
    return periodsPermittingStart.length > 0 || this.appConfigProvider.getAppConfig().role === ExaminerRole.DLG;
  }

  public dateDiffInDays = (startDate: Date, periodDate: Date): number => {
    // Discard the time and time-zone information.
    const utc1: number = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utc2: number = Date.UTC(periodDate.getFullYear(), periodDate.getMonth(), periodDate.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  };

  private hasPeriodStartCriteria = (slotDate: Date, periodFrom: string): boolean => {
    return this.dateDiffInDays(slotDate, new Date(periodFrom)) <= 0;
  };

  private hasPeriodEndCriteria = (slotDate: Date, periodTo: string): boolean => {
    if (!periodTo) {
      return true;
    }
    return this.dateDiffInDays(slotDate, new Date(periodTo)) >= 0;
  };

  getRelevantSlotItemsByDate = (slotItems: SlotItem[]): { [date: string]: SlotItem[] } => {
    let slotItemsByDate: { [date: string]: SlotItem[] };
    slotItemsByDate = groupBy(slotItems, this.getSlotDate);
    slotItemsByDate = this.extendWithEmptyDays(slotItemsByDate);
    slotItemsByDate = this.getRelevantSlots(slotItemsByDate);
    return slotItemsByDate;
  };
}
