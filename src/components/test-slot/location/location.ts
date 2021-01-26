import { Component, Input } from '@angular/core';

@Component({
  selector: 'location',
  templateUrl: 'location.html',
  styleUrls: ['location.scss'],
})
export class LocationComponent {

  @Input()
  location: string;

}
