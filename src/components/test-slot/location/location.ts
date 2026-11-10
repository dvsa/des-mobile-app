import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'location',
  templateUrl: 'location.html',
  styleUrls: ['location.scss'],
  imports: [IonIcon],
})
export class LocationComponent {
  @Input()
  location: string;
}
