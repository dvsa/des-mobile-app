import { Component, Input } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';

@Component({
  selector: 'driving-faults',
  templateUrl: './driving-faults.component.html',
  styleUrls: ['./driving-faults.component.scss'],
})
export class DrivingFaultsComponent {

  @Input()
  label: string;
  @Input()
  faults: FaultSummary[];
}
