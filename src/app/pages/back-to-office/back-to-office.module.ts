import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { BackToOfficeAnalyticsEffects } from '@pages/back-to-office/back-to-office.analytics.effects';
import {
  AsamFailureNotificationModal,
} from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';
import { BackToOfficePageRoutingModule } from './back-to-office-routing.module';

import { BackToOfficePage } from './back-to-office.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficePageRoutingModule,
    ComponentsModule,
    EffectsModule.forFeature([
      BackToOfficeAnalyticsEffects,
    ]),
  ],
  declarations: [
    BackToOfficePage,
    AsamFailureNotificationModal,
  ],
})
export class BackToOfficePageModule {}
