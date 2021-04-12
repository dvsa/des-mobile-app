import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { JournalProvider } from '@providers/journal/journal';
import { SlotProvider } from '@providers/slot/slot';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { JournalPage } from './journal.page';
import { TestSlotComponentsModule } from '../../../components/test-slot/test-slot-components.module';
import { JournalPageRoutingModule } from './journal-routing.module';
import { JournalComponentsModule } from './components/journal-components.module';
import { ComponentsModule } from '../../../components/common/common-components.module';
import { CandidateDetailsPageModule } from '../candidate-details/candidate-details.module';
import { ErrorPageModule } from '../error-page/error.module';

@NgModule({
  declarations: [
    JournalPage,
  ],
  imports: [
    JournalComponentsModule,
    TestSlotComponentsModule,
    IonicModule,
    EffectsModule.forFeature([
      // JournalAnalyticsEffects,
      // TestsEffects,
    ]),
    ErrorPageModule,
    JournalPageRoutingModule,
    CommonModule,
    ComponentsModule,
    CandidateDetailsPageModule,
  ],
  entryComponents: [],
  providers: [
    JournalProvider,
    NavParams,
    SlotProvider,
    SlotSelectorProvider,
    DateTimeProvider,
  ],
})
export class JournalPageModule {}
