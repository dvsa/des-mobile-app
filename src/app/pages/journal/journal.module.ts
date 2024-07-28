import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule, NavParams } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { JournalProvider } from '@providers/journal/journal';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { TestsEffects } from '@store/tests/tests.effects';

import { CompressionProvider } from '@providers/compression/compression';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { CandidateDetailsPageModule } from '../candidate-details/candidate-details.module';
import { ErrorPageModule } from '../error-page/error.module';
import { JournalComponentsModule } from './components/journal-components.module';
import { JournalPageRoutingModule } from './journal-routing.module';
import { JournalAnalyticsEffects } from './journal.analytics.effects';
import { JournalPage } from './journal.page';

@NgModule({
	declarations: [JournalPage],
	imports: [
		JournalComponentsModule,
		TestSlotComponentsModule,
		IonicModule,
		EffectsModule.forFeature([JournalAnalyticsEffects, TestsEffects]),
		ErrorPageModule,
		JournalPageRoutingModule,
		CommonModule,
		ComponentsModule,
		CandidateDetailsPageModule,
	],
	providers: [
		OrientationMonitorProvider,
		JournalProvider,
		NavParams,
		SlotProvider,
		SlotSelectorProvider,
		CompressionProvider,
		DateTimeProvider,
	],
})
export class JournalPageModule {}
