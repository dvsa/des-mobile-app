import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FindUserProvider } from '@providers/find-user/find-user';
import { RekeyReasonComponentsModule } from '@pages/rekey-reason/components/rekey-reason.components.module';
import { RekeyReasonAnalyticsEffects } from '@pages/rekey-reason/rekey-reason.analytics.effects';
import { RekeyReasonEffects } from '@pages/rekey-reason/rekey-reason.effects';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { RekeyReasonPage } from './rekey-reason.page';
import { RekeyReasonPageRoutingModule } from './rekey-reason-routing.module';
import { rekeyReasonReducer } from './rekey-reason.reducer';

@NgModule({
  declarations: [RekeyReasonPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonPageRoutingModule,
    ReactiveFormsModule,
    RekeyReasonComponentsModule,
    StoreModule.forFeature('rekeyReason', rekeyReasonReducer),
    EffectsModule.forFeature([
      RekeyReasonAnalyticsEffects,
      RekeyReasonEffects,
    ]),
    HeaderComponentModule,
  ],
  providers: [FindUserProvider],
})
export class RekeyReasonPageModule {}
