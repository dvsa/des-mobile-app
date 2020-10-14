import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-report-toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss'],
})
export class ToolbarComponent {

  isRemoveFaultMode = false;
  isDangerousMode = false;
  isSeriousMode = false;

  constructor() {}


}
