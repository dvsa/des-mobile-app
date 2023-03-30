import { groupBy } from 'lodash';
import { DateTime } from '@shared/helpers/date-time';

import { SlotItem } from '../../slot-selector/slot-item';

const localJournalJson = require('../../../../../mock/local-journal.json');

const slotItems: SlotItem[] = localJournalJson.testSlots.map((testSlot) => {
  return {
    hasSlotChanged: false,
    slotData: testSlot,
  };
});

const slots:{ [k: string]: SlotItem[] } = groupBy(
  slotItems, (slot: SlotItem) => DateTime.at(slot.slotData.slotDetail.start).format('YYYY-MM-DD'),
);

export default slots;
