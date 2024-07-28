import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeCatADIPart3PageRoutingModule } from '@pages/office/cat-adi-part3/office.cat-adi-part3-routing.module';
import { OfficeCatADI3Page } from '@pages/office/cat-adi-part3/office.cat-adi-part3.page';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';

@NgModule({
	declarations: [OfficeCatADI3Page],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		OfficeCatADIPart3PageRoutingModule,
		ComponentsModule,
		OfficeComponentsModule,
		ReactiveFormsModule,
		EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
	],
	providers: [FaultSummaryProvider],
})
export class OfficeCatADIPart3PageModule {}
