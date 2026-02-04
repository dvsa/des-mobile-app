import { NgModule } from '@angular/core';
import { ExitSingleAppModeAnalyticsEffects } from '@components/common/test-flow-header/exit-sam.analytics.effects';
import { ExitSingleAppModeEffects } from '@components/common/test-flow-header/exit-sam.effects';
import { EffectsModule } from '@ngrx/effects';
import { LoginPageAnalyticsEffects } from '@pages/login/login-page.analytics.effects';
import { AuthenticationAnalyticsEffects } from '@providers/authentication/authentication.analytics.effects';
import { LogoutBasePageAnalyticsEffects } from '@shared/classes/logout-base-page/logout-base-page.analytics.effects';
import { AccompanimentAnalyticsEffects } from '@store/tests/accompaniment/accompaniment.analytics.effects';
import { EyesightTestAnalyticsEffects } from '@store/tests/test-data/common/eyesight-test/eyesight-test.analytics.effects';
import { VehicleDetailsAnalyticsEffects } from '@store/tests/vehicle-details/vehicle-details.analytics.effects';

//Import the effects and Analytics effects for Standalone components that cannot do it themselves
@NgModule({
  imports: [
    EffectsModule.forFeature([ExitSingleAppModeEffects]),
    EffectsModule.forFeature([ExitSingleAppModeAnalyticsEffects]),
    EffectsModule.forFeature([LogoutBasePageAnalyticsEffects]),
    EffectsModule.forFeature([LoginPageAnalyticsEffects]),
    EffectsModule.forFeature([AuthenticationAnalyticsEffects]),
    EffectsModule.forFeature([EyesightTestAnalyticsEffects]),
    EffectsModule.forFeature([AccompanimentAnalyticsEffects]),
    EffectsModule.forFeature([VehicleDetailsAnalyticsEffects]),
  ],
})
export class EffectImportModule {}
