import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsPageModule } from '@pages/candidate-details/candidate-details.module';
import { FakeJournalComponentsModule } from '@pages/fake-journal/components/fake-journal-components.module';
import { FakeJournalPageRoutingModule } from '@pages/fake-journal/fake-journal-routing.module';
import { FakeJournalEffects } from '@pages/fake-journal/fake-journal.effects';
import { JournalComponentsModule } from '@pages/journal/components/journal-components.module';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';

import { FakeJournalAnalyticsEffects } from './fake-journal.analytics.effects';
import { FakeJournalPage } from './fake-journal.page';

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
		EffectsModule.forFeature([FakeJournalEffects, FakeJournalAnalyticsEffects]),
		JournalComponentsModule,
	],
	declarations: [FakeJournalPage],
	providers: [OrientationMonitorProvider],
})
export class FakeJournalPageModule {}
