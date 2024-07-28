import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { PostDebriefHoldingAnalyticsEffects } from '@pages/post-debrief-holding/post-debrief-holding.analytics.effects';
import { PostDebriefHoldingPageRoutingModule } from './post-debrief-holding-routing.module';
import { PostDebriefHoldingPage } from './post-debrief-holding.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		PostDebriefHoldingPageRoutingModule,
		ComponentsModule,
		EffectsModule.forFeature([PostDebriefHoldingAnalyticsEffects]),
	],
	declarations: [PostDebriefHoldingPage],
})
export class PostDebriefHoldingPageModule {}
