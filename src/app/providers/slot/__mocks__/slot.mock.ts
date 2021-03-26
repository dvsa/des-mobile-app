import { Injectable } from '@angular/core';
import { SlotItem } from '../../slot-selector/slot-item';

@Injectable()
export class SlotProviderMock {

  detectSlotChanges(): SlotItem[] {
    return [];
  }

  extendWithEmptyDays = (): { [k: string]: SlotItem[] } => {
    return {
      '2021-03-26': [],
    } as { [k: string]: SlotItem[] };
  };

  getRelevantSlots = (): { [k: string]: SlotItem[] } => {
    return {
      '2021-03-26': [],
    } as { [k: string]: SlotItem[] };
  };

  getSlotDate = (): string => '2021-03-26';

  canStartTest(): boolean {
    return true;
  }

  public dateDiffInDays = (): number => {
    return 1;
  };

  private hasPeriodStartCriteria = (): boolean => {
    return true;
  };

  private hasPeriodEndCriteria = (): boolean => {
    return true;
  };

  getRelevantSlotItemsByDate = (): { [date: string]: SlotItem[] } => {
    return {
      '2021-03-26': [],
    } as { [date: string]: SlotItem[] };
  };
}
