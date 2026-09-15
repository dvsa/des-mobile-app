import { Component, Input } from '@angular/core';
import { MotStatusDisplayTextComponent } from '@components/common/mot-status-display-text/mot-status-display-text.component';
import { RegistrationWithPreviousMotTextComponent } from '@components/common/registration-with-previous-mot-text/registration-with-previous-mot-text.component';
import { MotStatusCodes } from '@dvsa/mes-mot-schema';
import { IonCol, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'office-registration-and-mot',
  templateUrl: './office-registration-and-mot.component.html',
  styleUrls: ['./office-registration-and-mot.component.scss'],
  imports: [RegistrationWithPreviousMotTextComponent, MotStatusDisplayTextComponent, IonRow, IonCol, IonText],
  standalone: true,
})
export class OfficeRegistrationAndMotComponent {
  @Input()
  registrationNumber: string;

  @Input()
  previousVRNs: string[];

  @Input()
  vehicleMake: string;

  @Input()
  vehicleModel: string;

  @Input()
  motStatus: MotStatusCodes;

  @Input()
  motTestExpiryDate: string;
}
