import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';
import { refDataFeatureKey, referenceDataReducer } from '@store/reference-data/reference-data.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(refDataFeatureKey, referenceDataReducer),
    EffectsModule.forFeature([ReferenceDataEffects]),
  ],
})
export class ReferenceDataStoreModule {}
