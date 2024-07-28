import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';

import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { OfficeCatManoeuvrePageRoutingModule } from './office.cat-manoeuvre-routing.module';
import { OfficeCatManoeuvrePage } from './office.cat-manoeuvre.page';

@NgModule({
	declarations: [OfficeCatManoeuvrePage],
	imports: [
		EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
		ComponentsModule,
		CommonModule,
		ReactiveFormsModule,
		IonicModule,
		OfficeComponentsModule,
		OfficeCatManoeuvrePageRoutingModule,
		TestFinalisationComponentsModule,
		PassFinalisationComponentsModule,
		WaitingRoomToCarComponentsModule,
	],
	providers: [FaultSummaryProvider],
})
export class OfficeCatManoeuvrePageModule {}
