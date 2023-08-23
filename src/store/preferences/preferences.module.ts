import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { preferencesFeatureKey, preferencesReducer } from '@store/preferences/preferences.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(preferencesFeatureKey, preferencesReducer),
    EffectsModule.forFeature([]),
  ],
})
export class PreferencesStoreModule {
}
