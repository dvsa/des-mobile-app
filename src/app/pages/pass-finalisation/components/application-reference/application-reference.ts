import { Component, Input } from '@angular/core';

@Component({
  selector: 'application-reference-number',
  templateUrl: './application-reference.html',
  styleUrls: ['./application-reference.scss'],
})
export class ApplicationReferenceComponent {

  @Input()
  applicationNumber: string;

}
