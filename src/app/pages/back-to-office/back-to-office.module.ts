import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { BackToOfficeAnalyticsEffects } from '@pages/back-to-office/back-to-office.analytics.effects';
import { BackToOfficeEffects } from '@pages/back-to-office/back-to-office.effects';
import { AsamFailureNotificationModal } from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';
import { BackToOfficePageRoutingModule } from './back-to-office-routing.module';

import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { BackToOfficePage } from './back-to-office.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficePageRoutingModule,
    ComponentsModule,
    EffectsModule.forFeature([BackToOfficeEffects, BackToOfficeAnalyticsEffects]),
    TestFlowHeaderComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
  ],
  declarations: [BackToOfficePage, AsamFailureNotificationModal],
})
export class BackToOfficePageModule {}
