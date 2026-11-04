import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'profile-header',
  templateUrl: 'profile-header.html',
  styleUrls: ['profile-header.scss'],
  imports: [IonGrid, IonRow, IonCol, IonIcon, IonText],
})
export class ProfileHeaderComponent {
  @Input()
  name: string;

  @Input()
  role: string;

  @Input()
  employeeId: string;

  @Input()
  disableASAM: () => void;
}
