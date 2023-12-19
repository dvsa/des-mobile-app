import { Component, Input } from '@angular/core';
import { isNil } from 'lodash-es';
import { PersonalCommitment, TestSlot } from '@dvsa/mes-journal-schema';
import { SlotComponent } from '@components/test-slot/slot/slot';

@Component({
  selector: 'personal-commitment',
  templateUrl: 'personal-commitment.html',
  styleUrls: ['personal-commitment.scss'],
})
export class PersonalCommitmentSlotComponent implements SlotComponent {
  @Input()
  slot: TestSlot;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  @Input()
  personalCommitments: PersonalCommitment[];

  formatActivityCode(activityCode: any): string {
    if (isNil(activityCode)) {
      return '0';
    }
    // Remove leading zeros (e.g. 089 -> 89)
    return activityCode.toString()
      .replace(/^0+(?!$)/, '');
  }

  transformSlotTime(time: string, index: number) {
    return index === 0 ? time : null;
  }
}
