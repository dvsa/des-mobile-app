import { Booking, SlotDetail, TestCentre } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { DateTime } from '@shared/helpers/date-time';
import { MesError } from '@shared/models/mes-error.model';

export type Slot = {
  booking?: Booking;
  slotDetail: SlotDetail;
  testCentre: TestCentre;
  vehicleTypeCode?: string;
  activityCode?: string;
};

export type JournalModel = {
  isLoading: boolean;
  lastRefreshed: DateTime;
  slots: { [k: string]: SlotItem[] };
  error?: MesError;
  selectedDate: string;
  examiner: Examiner;
  completedTests: SearchResultTestSchema[];
  recallAutoPopupLastDisplayedTime: string;
};

export interface ExaminerSlotItems {
  examiner: Examiner;
  slotItems: SlotItem[];
}

export interface ExaminerSlotItemsByDate {
  examiner: Examiner;
  slotItemsByDate: { [date: string]: SlotItem[] };
}
