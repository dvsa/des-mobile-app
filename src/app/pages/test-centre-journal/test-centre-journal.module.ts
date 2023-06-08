import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { TestCentreJournalAnalyticsEffects } from '@pages/test-centre-journal/test-centre-journal.analytics.effects';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';

import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { TestCentreJournalPage } from './test-centre-journal.page';
import { TestCentreJournalRoutingModule } from './test-centre-journal-routing.module';
import { TestCentreJournalComponentsModule } from './components/test-centre-journal-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCentreJournalRoutingModule,
    TestCentreJournalComponentsModule,
    ComponentsModule,
    TestSlotComponentsModule,
    EffectsModule.forFeature([
      TestCentreJournalAnalyticsEffects,
    ]),
    CandidateDetailsPageModule,
  ],
  declarations: [
    TestCentreJournalPage,
  ],
  providers: [
    SlotSelectorProvider,
    SlotProvider,
    OrientationMonitorProvider,
  ],
})
export class TestCentreJournalModule { }
