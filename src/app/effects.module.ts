import { NgModule } from '@angular/core';
import { ExitSingleAppModeAnalyticsEffects } from '@components/common/test-flow-header/exit-sam.analytics.effects';
import { ExitSingleAppModeEffects } from '@components/common/test-flow-header/exit-sam.effects';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationAnalyticsEffects } from '@providers/authentication/authentication.analytics.effects';
import { LogoutBasePageAnalyticsEffects } from '@shared/classes/logout-base-page/logout-base-page.analytics.effects';

//Import the effects and Analytics effects for Standalone components that cannot do it themselves
@NgModule({
  imports: [
    EffectsModule.forFeature([ExitSingleAppModeEffects]),
    EffectsModule.forFeature([ExitSingleAppModeAnalyticsEffects]),
    EffectsModule.forFeature([LogoutBasePageAnalyticsEffects]),
    EffectsModule.forFeature([AuthenticationAnalyticsEffects]),
  ],
})
export class EffectImportModule {}
