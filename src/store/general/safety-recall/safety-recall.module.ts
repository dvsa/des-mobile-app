import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { SafetyRecallAnalyticsEffects } from '@store/general/safety-recall/safety-recall.analytics.effects';

@NgModule({
  imports: [EffectsModule.forFeature([SafetyRecallAnalyticsEffects])],
})
export class SafetyRecallModule {}
