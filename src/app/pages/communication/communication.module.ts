import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CommunicationAnalyticsEffects } from '@pages/communication/communication.analytics.effects';
import { CommunicationEffects } from '@pages/communication/communication.effects';
import { CommunicationComponentsModule } from '@pages/communication/components/communication.components.module';
import { CommunicationPageRoutingModule } from './communication-routing.module';
import { CommunicationPage } from './communication.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CommunicationPageRoutingModule,
		ComponentsModule,
		TranslateModule,
		CommunicationComponentsModule,
		ReactiveFormsModule,
		EffectsModule.forFeature([CommunicationEffects, CommunicationAnalyticsEffects]),
		DirectivesModule,
	],
	declarations: [CommunicationPage],
})
export class CommunicationPageModule {}
