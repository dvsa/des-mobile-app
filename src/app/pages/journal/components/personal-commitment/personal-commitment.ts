import { Component, Input } from '@angular/core';
import { LocationComponent } from '@components/test-slot/location/location';
import { SlotComponent } from '@components/test-slot/slot/slot';
import { TimeComponent } from '@components/test-slot/time/time';
import { PersonalCommitment, TestSlot } from '@dvsa/mes-journal-schema';
import { IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { isNil } from 'lodash-es';

@Component({
  selector: 'personal-commitment',
  templateUrl: 'personal-commitment.html',
  styleUrls: ['personal-commitment.scss'],
  imports: [LocationComponent, IonCard, IonRow, IonCol, TimeComponent, IonText],
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

  formatActivityCode(activityCode: string): string {
    if (isNil(activityCode)) {
      return '0';
    }
    // Remove leading zeros (e.g. 089 -> 89)
    return activityCode.toString().replace(/^0+(?!$)/, '');
  }

  transformSlotTime(time: string, index: number) {
    return index === 0 ? time : null;
  }
}
