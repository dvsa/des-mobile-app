import { TestSlot } from '@dvsa/mes-journal-schema';

export interface SlotComponent {
  slot: TestSlot;
  hasSlotChanged: boolean;
  showLocation: boolean;
  isTeamJournal?: boolean;
}
