import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FakeJournalPageRoutingModule } from '@pages/fake-journal/fake-journal-routing.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { FakeJournalComponentsModule } from '@pages/fake-journal/components/fake-journal-components.module';
import { EffectsModule } from '@ngrx/effects';
import { FakeJournalEffects } from '@pages/fake-journal/fake-journal.effects';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';
import { FakeJournalPage } from './fake-journal.page';
import { FakeJournalAnalyticsEffects } from './fake-journal.analytics.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FakeJournalPageRoutingModule,
    ComponentsModule,
    TestSlotComponentsModule,
    FakeJournalComponentsModule,
    CandidateDetailsPageModule,
    EffectsModule.forFeature([
      FakeJournalEffects,
      FakeJournalAnalyticsEffects,
    ]),
  ],
  declarations: [
    FakeJournalPage,
  ],
})
export class FakeJournalPageModule {
}
