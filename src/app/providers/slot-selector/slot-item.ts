import { Type } from '@angular/core';
import { SlotComponent } from '@components/test-slot/slot/slot';
import { NonTestActivity, PersonalCommitment, TestSlot } from '@dvsa/mes-journal-schema';

export class SlotItem {
	constructor(
		public slotData: TestSlot | NonTestActivity,
		public hasSlotChanged: boolean,
		public hasSeenCandidateDetails: boolean,
		public component?: Type<SlotComponent>,
		public activityCode?: string,
		public personalCommitment?: PersonalCommitment[]
	) {}
}
