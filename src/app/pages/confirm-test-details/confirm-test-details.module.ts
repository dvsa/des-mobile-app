import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { ConfirmTestDetailsPageRoutingModule } from '@pages/confirm-test-details/confirm-test-details-routing.module';
import { ConfirmSubmitModal } from '@pages/confirm-test-details/components/confirm-submit-modal/confirm-submit-modal';
import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import { ConfirmTestDetailsPage } from './confirm-test-details.page';

@NgModule({
  declarations: [
    ConfirmTestDetailsPage,
    ConfirmSubmitModal,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    ConfirmTestDetailsPageRoutingModule,
    EffectsModule.forFeature([
      ConfirmTestDetailsAnalyticsEffects,
    ]),
  ],
})
export class ConfirmTestDetailsPageModule {}
