import {
  Component, Input, OnChanges,
} from '@angular/core';
import { lowerCase } from 'lodash';

@Component({
  selector: 'vehicle-mot-status',
  templateUrl: './vehicle-mot-status.html',
  styleUrls: ['./vehicle-mot-status.scss'],
})
export class VehicleMotStatusComponent implements OnChanges {

  @Input()
  motStatus: string = null;

  icon: boolean = false;
  positiveOutcome: boolean = false;
  label: string = '';

  ngOnChanges(): void {
    this.setMOTStatus(this.motStatus);
  }

  setMOTStatus(status: string): void {
    if (status === null) {
      this.icon = false;
      this.positiveOutcome = false;
      this.label = '';
      return;
    }
    if (status === undefined) {
      this.icon = false;
      this.positiveOutcome = false;
      this.label = 'No MOT details';
      return;
    }
    if (lowerCase(status) === 'valid') {
      this.icon = true;
      this.positiveOutcome = true;
      this.label = `MOT: ${status}`;
      return;
    }
    if (lowerCase(status) === 'invalid') {
      this.icon = true;
      this.positiveOutcome = false;
      this.label = `MOT: ${status}`;
      return;
    }
    this.icon = false;
    this.positiveOutcome = false;
    this.label = `MOT: ${status}`;
  }
}
