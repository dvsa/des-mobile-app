import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DateTimeProvider } from '@providers/date-time/date-time';
import { JournalProvider } from '@providers/journal/journal';
import { SearchProvider } from '@providers/search/search';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { JournalEffects } from './journal.effects';
import { JournalLogsEffects } from './journal.logs.effects';
import { journalReducer } from './journal.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('journal', journalReducer),
    EffectsModule.forFeature([JournalEffects, JournalLogsEffects]),
    RouterModule,
  ],
  providers: [JournalProvider, SlotProvider, SlotSelectorProvider, DateTimeProvider, SearchProvider],
})
export class JournalModule {}
