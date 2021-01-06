import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { logsFeatureKey, logsReducer } from './logs.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(logsFeatureKey, logsReducer),
  ],
})
export class LogsModule { }
