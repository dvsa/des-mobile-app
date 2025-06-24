import { Component } from '@angular/core';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';

@Component({
  selector: 'safety-recall',
  styleUrls: ['safety-recall.scss'],
  templateUrl: './safety-recall.html',
})
export class SafetyRecallComponent {
  constructor(public exitSAMProvider: ExitSAMProvider) {}

  checkRecall(): void {
    // Logic to check for safety recalls would go here
    this.exitSAMProvider.disableSAMAndExitForRecalls(ExitSAMMethodUsed.VIN_CHECK);
  }
}
