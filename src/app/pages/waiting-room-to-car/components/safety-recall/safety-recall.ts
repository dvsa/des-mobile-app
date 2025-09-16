import { Component } from '@angular/core';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { StoreModel } from '@shared/models/store.model';
import { CheckVINPressed } from '@store/general/safety-recall/safety-recall.actions';

@Component({
  selector: 'safety-recall',
  templateUrl: './safety-recall.html',
  imports: [IonicModule],
})
export class SafetyRecallComponent {
  constructor(
    public exitSAMProvider: ExitSAMProvider,
    private store$: Store<StoreModel>
  ) {}

  async checkRecall(): Promise<void> {
    this.store$.dispatch(CheckVINPressed());
    // Logic to check for safety recalls would go here
    await this.exitSAMProvider.disableSAMAndExitForRecalls(ExitSAMMethodUsed.VIN_CHECK);
  }
}
