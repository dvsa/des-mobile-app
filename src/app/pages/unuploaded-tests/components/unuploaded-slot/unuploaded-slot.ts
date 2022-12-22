import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';

@Component({
  selector: 'unuploaded-slot',
  templateUrl: 'unuploaded-slot.html',
  styleUrls: ['unuploaded-slot.scss'],
})
export class UnuploadedSlot {

  @Input()
  count: number;

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

  @Input()
  slotID: number;

  @Output()
  writeUpClicked = new EventEmitter<{ slotID: number; category: string; }>();

  writeUpClick = () => this.writeUpClicked.emit({
    slotID: this.slotID,
    category: this.category,
  });

}
