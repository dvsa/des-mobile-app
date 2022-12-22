import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';

@Component({
  selector: 'unuploaded-slot',
  templateUrl: 'unuploaded-slot.html',
})
export class UnuploadedSlot {

  @Input()
  slotStartDate: string;

  @Input()
  appRef: string;

  @Input()
  candidateTitledName: string;

  @Input()
  category: string;

  @Input()
  driverNumber: string;

  @Output()
  writeUpClicked = new EventEmitter<string>();

  writeUpClick = () => this.writeUpClicked.emit(this.appRef);

}
