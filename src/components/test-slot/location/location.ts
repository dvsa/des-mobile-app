import { Component, Input } from '@angular/core';

@Component({
  selector: 'location',
  templateUrl: 'location.html',
})
export class LocationComponent {

  @Input()
  location: string;

}
