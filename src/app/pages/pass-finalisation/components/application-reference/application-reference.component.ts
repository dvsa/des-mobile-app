import { Component, Input } from '@angular/core';

@Component({
  selector: 'application-reference-number',
  templateUrl: './application-reference.component.html',
  styleUrls: ['./application-reference.component.scss'],
})
export class ApplicationReferenceComponent {

  @Input()
  applicationNumber: string;

}
