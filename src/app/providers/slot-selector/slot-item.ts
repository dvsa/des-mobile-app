import { Type } from '@angular/core';
import { TestSlot, NonTestActivity, PersonalCommitment } from '@dvsa/mes-journal-schema';
import { SlotComponent } from '../../components/test-slot/slot/slot';

export class SlotItem {
  constructor(
    public slotData: TestSlot | NonTestActivity,
    public hasSlotChanged: boolean,
    public hasSeenCandidateDetails: boolean,
    public component?: Type<SlotComponent>,
    public activityCode?: string,
    public personalCommitment?: PersonalCommitment[],
  ) { }
}
