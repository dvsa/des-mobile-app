import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RekeyReasonComponentsModule } from '@pages/rekey-reason/components/rekey-reason.components.module';
import { RekeyReasonAnalyticsEffects } from '@pages/rekey-reason/rekey-reason.analytics.effects';
import { RekeyReasonEffects } from '@pages/rekey-reason/rekey-reason.effects';
import { FindUserProvider } from '@providers/find-user/find-user';
import { RekeyReasonPageRoutingModule } from './rekey-reason-routing.module';
import { RekeyReasonPage } from './rekey-reason.page';
import { rekeyReasonReducer } from './rekey-reason.reducer';

@NgModule({
	declarations: [RekeyReasonPage],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RekeyReasonPageRoutingModule,
		ReactiveFormsModule,
		RekeyReasonComponentsModule,
		StoreModule.forFeature('rekeyReason', rekeyReasonReducer),
		EffectsModule.forFeature([RekeyReasonAnalyticsEffects, RekeyReasonEffects]),
	],
	providers: [FindUserProvider],
})
export class RekeyReasonPageModule {}
