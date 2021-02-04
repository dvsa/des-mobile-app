import { SlotItem } from '../../../../../providers/slot-selector/slot-item';

// In order for the navigation to work we just need 3 days in slots
// The days can be empty because we don't care about the actual slots

const emptyDays = {
  '2019-02-01': [],
  '2019-02-02': [],
  '2019-02-03': [],
};

const slots: {[k: string]: SlotItem[]} = emptyDays;

export default slots;
