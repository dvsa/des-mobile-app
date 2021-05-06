import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { JournalProvider } from '@providers/journal/journal';
import { SearchProvider } from '@providers/search/search';
import { JournalLogsEffects } from './journal.logs.effects';
import { journalReducer } from './journal.reducer';
import { JournalEffects } from './journal.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('journal', journalReducer),
    EffectsModule.forFeature([
      JournalEffects,
      JournalLogsEffects,
    ]),
    RouterModule,
  ],
  providers: [
    JournalProvider,
    SlotProvider,
    SlotSelectorProvider,
    DateTimeProvider,
    SearchProvider,
  ],
})
export class JournalModule {}
