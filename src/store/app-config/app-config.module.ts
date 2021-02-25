import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
// import { AppInfoEffects } from './app-info.effects';
import * as fromAppConfigReducer from './app-config.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fromAppConfigReducer.appConfigFeatureKey, fromAppConfigReducer.appConfigReducer),
    // EffectsModule.forFeature([AppInfoEffects]),
    EffectsModule.forFeature([]),
  ],
})
export class AppConfigStoreModule { }
