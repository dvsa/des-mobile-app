import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { logsFeatureKey, logsReducer } from './logs.reducer';
import { LogsEffects } from './logs.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(logsFeatureKey, logsReducer),
    EffectsModule.forFeature([LogsEffects]),
  ],
})
export class LogsStoreModule { }
