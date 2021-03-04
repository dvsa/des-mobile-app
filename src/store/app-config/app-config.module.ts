import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppConfigEffects } from './app-config.effects';
import * as fromAppConfigReducer from './app-config.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fromAppConfigReducer.appConfigFeatureKey, fromAppConfigReducer.appConfigReducer),
    EffectsModule.forFeature([AppConfigEffects]),
  ],
})
export class AppConfigStoreModule { }
