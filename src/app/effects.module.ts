import { NgModule } from '@angular/core';
import { ExitSingleAppModeAnalyticsEffects } from '@components/common/test-flow-header/exit-sam.analytics.effects';
import { ExitSingleAppModeEffects } from '@components/common/test-flow-header/exit-sam.effects';
import { EffectsModule } from '@ngrx/effects';

//Import the effects and Analytics effects for Standalone components that cannot do it themselves
@NgModule({
  imports: [
    EffectsModule.forFeature([ExitSingleAppModeEffects]),
    EffectsModule.forFeature([ExitSingleAppModeAnalyticsEffects]),
  ],
})
export class EffectImportModule {}
