import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SlotComponent } from '@components/test-slot/slot/slot';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { LocationComponent } from '../../../../../components/test-slot/location/location';
import { TimeComponent } from '../../../../../components/test-slot/time/time';

@Component({
  selector: 'empty-slot',
  templateUrl: 'empty-slot.html',
  styleUrls: ['empty-slot.scss'],
  imports: [LocationComponent, IonCard, NgClass, IonRow, IonCol, TimeComponent, IonText],
})
export class EmptySlotComponent implements SlotComponent {
  @Input()
  slot: TestSlot;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  @Input()
  isPortrait = false;
}
