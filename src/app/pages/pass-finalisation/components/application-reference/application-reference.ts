import { Component, Input } from '@angular/core';

@Component({
  selector: 'application-reference-number',
  templateUrl: './application-reference.html',
})
export class ApplicationReferenceComponent {

  @Input()
  applicationNumber: string;

}
