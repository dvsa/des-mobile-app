import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'registration-with-previous-mot-text',
  templateUrl: './registration-with-previous-mot-text.component.html',
  styleUrls: ['./registration-with-previous-mot-text.component.scss'],
  imports: [IonicModule],
})
export class RegistrationWithPreviousMotTextComponent {
  @Input()
  previouslySearchedRegNumbers: string[];

  @Input()
  registrationNumber: string;

  /**
   * Get the registration text based on the current registration number and previously filtered VRNs.
   *
   * @returns {string} - The registration text. Possible values are:
   *   - The current registration number if it exists.
   *   - 'Removed' if there are previously filtered VRNs and no current registration number.
   *   - 'None' if there are no previously filtered VRNs and no current registration number.
   */
  getRegistrationText(): string {
    if (this.registrationNumber) {
      return this.registrationNumber;
    }
    if (this.previouslySearchedRegNumbers?.length > 0) {
      return 'Removed';
    }
    return 'None';
  }
}
