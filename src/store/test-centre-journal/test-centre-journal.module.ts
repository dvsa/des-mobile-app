import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestCentreJournalEffects } from './test-centre-journal.effects';
import * as fromTestCentreJournalReducer from './test-centre-journal.reducer';

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
})
export class TestCentreJournalStoreModule { }
