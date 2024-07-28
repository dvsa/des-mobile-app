import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LogsEffects } from './logs.effects';
import { logsFeatureKey, logsReducer } from './logs.reducer';

@NgModule({
  imports: [StoreModule.forFeature(logsFeatureKey, logsReducer), EffectsModule.forFeature([LogsEffects])],
})
export class LogsStoreModule {}
