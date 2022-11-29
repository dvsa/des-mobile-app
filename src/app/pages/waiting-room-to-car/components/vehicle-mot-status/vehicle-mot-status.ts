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

  @Input()
  showSpinner: boolean;

  @Input()
  reset: boolean;

  icon: boolean = false;
  positiveOutcome: boolean = false;
  label: string = '';
  confirmed: boolean = false;
  registrationConfirmed: string = '';

  ngOnChanges(): void {
    // reset  on registration change
    if (this.reset) {
      console.log('RESET');
      this.resetValues();
    }

    this.setMOTStatus(this.motStatus);
  }

  resetValues(): void {
    this.icon = false;
    this.positiveOutcome = false;
    this.label = '';
    this.confirmed = false;
    // this.registrationConfirmed = '';
  }

  setMOTStatus(status: string): void {
    console.log('status', status);
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

  setConfirmRegistration(): void {
    this.confirmed = true;
    // this.registrationConfirmed = this.vehicleRegistration;
  }

  displayConfirmRegistration(): boolean {
    return this.motStatus?.length > 0
      && !this.positiveOutcome
      && !this.confirmed;
  }
}
