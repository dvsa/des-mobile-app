import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserInfoEffects } from './user-info.effects';
import * as fromUserInfoReducer from './user-info.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fromUserInfoReducer.userInfoFeatureKey, fromUserInfoReducer.userInfoReducer),
    EffectsModule.forFeature([UserInfoEffects]),
  ],
})
export class UserInfoStoreModule {}
