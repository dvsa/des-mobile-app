import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';
import { TestCentreJournalAnalyticsEffects } from '@pages/test-centre-journal/test-centre-journal.analytics.effects';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';

import { RefreshButtonComponent } from '@components/common/refresh-button/refresh-button.component';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { TestCentreJournalComponentsModule } from './components/test-centre-journal-components.module';
import { TestCentreJournalRoutingModule } from './test-centre-journal-routing.module';
import { TestCentreJournalPage } from './test-centre-journal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCentreJournalRoutingModule,
    TestCentreJournalComponentsModule,
    ComponentsModule,
    TestSlotComponentsModule,
    EffectsModule.forFeature([TestCentreJournalAnalyticsEffects]),
    CandidateDetailsPageModule,
    TestFlowHeaderComponent,
    RefreshButtonComponent,
  ],
  declarations: [TestCentreJournalPage],
  providers: [SlotSelectorProvider, SlotProvider, OrientationMonitorProvider],
})
export class TestCentreJournalModule {}
