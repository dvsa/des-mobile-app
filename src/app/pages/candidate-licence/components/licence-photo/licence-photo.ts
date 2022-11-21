import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'licence-photo',
  templateUrl: 'licence-photo.html',
  styleUrls: ['licence-photo.scss'],
})
export class LicencePhoto {

  @Input()
  imageSrc: SafeUrl | string;

  @Input()
  hasError: boolean = false;

}
