import { Component, Input } from '@angular/core';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SlotComponent } from '../../../../../components/test-slot/slot/slot';
import { Slot } from '../../../../../store/journal/journal.model';

@Component({
  selector: 'empty-slot',
  templateUrl: 'empty-slot.html',
})
export class EmptySlotComponent implements SlotComponent {
  @Input()
  slot: Slot;

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
