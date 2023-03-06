import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { refDataFeatureKey, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(refDataFeatureKey, referenceDataReducer),
    EffectsModule.forFeature([ReferenceDataEffects]),
  ],
})
export class ReferenceDataStoreModule { }
