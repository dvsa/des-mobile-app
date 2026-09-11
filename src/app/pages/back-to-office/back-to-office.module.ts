import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { BackToOfficeAnalyticsEffects } from '@pages/back-to-office/back-to-office.analytics.effects';
import { BackToOfficeEffects } from '@pages/back-to-office/back-to-office.effects';
import { AsamFailureNotificationModal } from '@pages/back-to-office/components/asam-failure-notification/asam-failure-notification-modal';
import { BackToOfficePageRoutingModule } from './back-to-office-routing.module';

import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { IonButton, IonCard, IonCol, IonContent, IonHeader, IonRow, IonText, IonToolbar } from '@ionic/angular';
import { BackToOfficePage } from './back-to-office.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    BackToOfficePageRoutingModule,
    ComponentsModule,
    EffectsModule.forFeature([BackToOfficeEffects, BackToOfficeAnalyticsEffects]),
    TestFlowHeaderComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
    IonCol,
    IonRow,
    IonButton,
    IonText,
    IonCard,
    IonContent,
    IonToolbar,
    IonHeader,
  ],
  declarations: [BackToOfficePage, AsamFailureNotificationModal],
})
export class BackToOfficePageModule {}
