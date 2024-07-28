import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { CircuitComponent } from '@pages/office/cat-a-mod1/components/circuit/circuit';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { PipesModule } from '@shared/pipes/pipes.module';
import { OfficeCatAMod1PageRoutingModule } from './office.cat-a-mod1-routing.module';
import { OfficeCatAMod1Page } from './office.cat-a-mod1.page';

@NgModule({
	declarations: [OfficeCatAMod1Page, CircuitComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		OfficeCatAMod1PageRoutingModule,
		ComponentsModule,
		OfficeComponentsModule,
		ReactiveFormsModule,
		DebriefComponentsModule,
		PipesModule,
		EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
		WaitingRoomToCarComponentsModule,
	],
	providers: [FaultSummaryProvider],
})
export class OfficeCatAMod1PageModule {}
