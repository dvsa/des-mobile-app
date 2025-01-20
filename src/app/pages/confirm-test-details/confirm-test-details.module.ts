import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { PageHeaderComponent } from '@components/common/page-header/page-header.component';
import { ConfirmSubmitModal } from '@pages/confirm-test-details/components/confirm-submit-modal/confirm-submit-modal';
import { ConfirmTestDetailsPageRoutingModule } from '@pages/confirm-test-details/confirm-test-details-routing.module';
import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import { ConfirmTestDetailsPage } from './confirm-test-details.page';

@NgModule({
  declarations: [ConfirmTestDetailsPage, ConfirmSubmitModal],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    ConfirmTestDetailsPageRoutingModule,
    EffectsModule.forFeature([ConfirmTestDetailsAnalyticsEffects]),
    PageHeaderComponent,
  ],
})
export class ConfirmTestDetailsPageModule {}
