import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MotStatusCodes } from '@dvsa/mes-mot-schema';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'mot-status-display-text',
  templateUrl: './mot-status-display-text.component.html',
  styleUrls: ['./mot-status-display-text.component.scss'],
  imports: [NgIf, IonicModule],
  standalone: true,
})
export class MotStatusDisplayTextComponent {
  @Input()
  registrationNumber: string;

  @Input()
  previousVRNs: string[] = [];

  @Input()
  motStatus: MotStatusCodes = null;

  @Input()
  motTestExpiryDate: string;

  /**
   * Check if the vehicle's MOT status is invalid.
   *
   * @returns {boolean} - Returns true if the MOT status is NOT\_VALID, otherwise false.
   */
  isInvalidMOT(): boolean {
    return this.motStatus === 'Not valid';
  }

  /**
   * Get the MOT status text based on the vehicle's MOT status and test expiry date.
   *
   * @returns {string} - The MOT status text. Possible values are:
   *   - 'Valid until {testExpiryDate}' if the MOT status is valid and a test expiry date is available.
   *   - 'Valid' if the MOT status is valid but no test expiry date is available.
   *   - The MOT status text directly if the MOT status is not invalid.
   *   - 'Expired {testExpiryDate}' if the MOT status is invalid and a test expiry date is available.
   *   - 'Not valid' if the MOT status is invalid and no test expiry date is available.
   */
  getMotStatusText(): string {
    if (this.motStatus === 'Valid') {
      if (this.motTestExpiryDate) {
        return `Valid until ${this.motTestExpiryDate}`;
      }
      return 'Valid';
    }
    if (!this.isInvalidMOT()) {
      return this.motStatus;
    }
    return this.motTestExpiryDate ? `Expired ${this.motTestExpiryDate}` : 'Not valid';
  }

  /**
   * Get the text indicating the absence of MOT data.
   *
   * @returns {string} - The text indicating the absence of MOT data. Possible values are:
   *   - 'Unable to determine MOT status for {registrationNumber}' if a registration number is available and there are previously filtered VRNs.
   *   - 'Unable to determine MOT status' if there are previously filtered VRNs but no registration number.
   *   - 'No VRNs were checked for MOT' if there are no previously filtered VRNs and a registration number.
   */
  getNoMOTDataText(): string {
    if (this.registrationNumber && this.previousVRNs?.length > 0) {
      return `Unable to determine MOT status for ${this.registrationNumber}`;
    }
    if (this.previousVRNs?.length > 0) {
      return 'Unable to determine MOT status';
    }
    return 'No VRNs were checked for MOT';
  }
}
