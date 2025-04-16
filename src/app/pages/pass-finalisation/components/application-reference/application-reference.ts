import { Component, Input } from '@angular/core';

@Component({
  selector: 'application-reference-number',
  templateUrl: './application-reference.html',
  standalone: false,
})
export class ApplicationReferenceComponent {
  @Input()
  applicationNumber: string;
}
