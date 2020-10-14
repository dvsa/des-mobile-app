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



  toggleRemoveFaultMode(): void {
    this.isRemoveFaultMode = !this.isRemoveFaultMode;
  }

  toggleSeriousMode(): void {
    if (this.isDangerousMode) {
      this.isDangerousMode = false;
    }
    this.isSeriousMode = !this.isSeriousMode;
  }

  toggleDangerousMode(): void {
    if (this.isSeriousMode) {
      this.isSeriousMode = false;
    }
    this.isDangerousMode = !this.isDangerousMode;
  }

}
