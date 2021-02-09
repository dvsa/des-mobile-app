import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { JournalPage } from './journal.page';
// import { SlotSelectorProvider } from '../../providers/slot-selector/slot-selector';
// import { ActivitySlotComponent } from './components/activity-slot/activity-slot';
// import { EmptySlotComponent } from './components/empty-slot/empty-slot';
import { JournalProvider } from '../../providers/journal/journal';
import { SlotProvider } from '../../providers/slot/slot';
import { DateTimeProvider } from '../../providers/date-time/date-time';
// import { TestsEffects } from '../../modules/tests/tests.effects';
import { TestSlotComponentsModule } from '../../../components/test-slot/test-slot-components.module';
// import { JournalAnalyticsEffects } from './journal.analytics.effects';

import { JournalPageRoutingModule } from './journal-routing.module';
import { JournalComponentsModule } from './components/journal-components.module';
import { ComponentsModule } from '../../../components/common/common-components.module';
import { CandidateDetailsPageModule } from '../candidate-details/candidate-details.module';

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
    JournalPageRoutingModule,
    CommonModule,
    ComponentsModule,
    CandidateDetailsPageModule,
  ],
  entryComponents: [
    // ActivitySlotComponent,
    // EmptySlotComponent,
  ],
  providers: [
    JournalProvider,
    NavParams,
    SlotProvider,
    // SlotSelectorProvider,
    DateTimeProvider,
  ],
})
export class JournalPageModule {}
