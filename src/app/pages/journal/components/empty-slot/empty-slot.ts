import { Component, Input } from '@angular/core';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { SlotComponent } from '../../../../../components/test-slot/slot/slot';

@Component({
  selector: 'empty-slot',
  templateUrl: 'empty-slot.html',
  styleUrls: ['empty-slot.scss'],
})
export class EmptySlotComponent implements SlotComponent {
  @Input()
  slot: TestSlot;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  // constructor(public screenOrientation: ScreenOrientation) {}

  // isPortrait() : boolean {
  //   return this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY ||
  //     this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT;
  // }
  // @TODO: Update with real implementation
  isPortrait() : boolean {
    return true;
  }
}
