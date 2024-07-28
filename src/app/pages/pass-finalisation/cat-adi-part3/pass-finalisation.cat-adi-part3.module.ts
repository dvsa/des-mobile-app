import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationCatADI3ComponentsModule } from '@pages/pass-finalisation/cat-adi-part3/components/pass-finalisation.cat-adi3.components.module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { PassFinalisationCatADIPart3PageRoutingModule } from './pass-finalisation.cat-adi-part3-routing.module';
import { PassFinalisationCatADIPart3Page } from './pass-finalisation.cat-adi-part3.page';

@NgModule({
	imports: [
		CommonModule,
		DirectivesModule,
		FormsModule,
		IonicModule,
		PassFinalisationCatADIPart3PageRoutingModule,
		ComponentsModule,
		TestFinalisationComponentsModule,
		ReactiveFormsModule,
		PassFinalisationCatADI3ComponentsModule,
		EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
	],
	declarations: [PassFinalisationCatADIPart3Page],
})
export class PassFinalisationCatADIPart3PageModule {}
