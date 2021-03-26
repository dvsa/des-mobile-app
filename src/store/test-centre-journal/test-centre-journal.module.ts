import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestCentreJournalEffects } from './test-centre-journal.effects';
import * as fromTestCentreJournalReducer from './test-centre-journal.reducer';
import { SlotSelectorProvider } from '../../app/providers/slot-selector/slot-selector';
import { SlotProvider } from '../../app/providers/slot/slot';

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromTestCentreJournalReducer.testCentreJournalFeatureKey,
      fromTestCentreJournalReducer.testCentreJournalReducer,
    ),
    EffectsModule.forFeature([
      TestCentreJournalEffects,
    ]),
  ],
  providers: [
    SlotSelectorProvider,
    SlotProvider,
  ],
})
export class TestCentreJournalStoreModule { }
