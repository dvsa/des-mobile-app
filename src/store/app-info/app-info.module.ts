import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppInfoEffects } from './app-info.effects';
import * as fromAppInfoReducer from './app-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fromAppInfoReducer.appInfoFeatureKey, fromAppInfoReducer.appInfoReducer),
    EffectsModule.forFeature([AppInfoEffects]),
  ],
})
export class AppInfoStoreModule { }
