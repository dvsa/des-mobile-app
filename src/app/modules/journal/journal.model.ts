import { Booking, SlotDetail, TestCentre } from '@dvsa/mes-journal-schema';
import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { SlotItem } from '../../providers/slot-selector/slot-item';
import { MesError } from '../../shared/models/mes-error.model';

export type Slot = {
  booking?: Booking,
  slotDetail: SlotDetail,
  testCentre: TestCentre,
  vehicleTypeCode?: string;
  activityCode?: string,
};

export type JournalModel = {
  isLoading: boolean,
  lastRefreshed: Date,
  slots: { [k: string]: SlotItem[] },
  error?: MesError,
  selectedDate: string,
  examiner: Examiner,
  completedTests: SearchResultTestSchema[],
};

export interface ExaminerSlotItems {
  examiner: Examiner;
  slotItems: SlotItem[];
}

export interface ExaminerSlotItemsByDate {
  examiner: Examiner;
  slotItemsByDate: { [date: string]: SlotItem[] };
}
