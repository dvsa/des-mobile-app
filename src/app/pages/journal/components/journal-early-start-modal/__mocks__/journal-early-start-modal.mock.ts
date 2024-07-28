import { SlotDetail } from '@dvsa/mes-journal-schema';
import { DateTime } from '@shared/helpers/date-time';

export class JournalEarlyStartModalMock {
	public mockSlotDetail(): SlotDetail {
		return {
			duration: 57,
			slotId: 123,
			start: new DateTime('2000-01-01').toString(),
		};
	}
}
