import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { ConfirmSubmitModal } from '@pages/confirm-test-details/components/confirm-submit-modal/confirm-submit-modal';
import { ConfirmTestDetailsPageRoutingModule } from '@pages/confirm-test-details/confirm-test-details-routing.module';
import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import { ConfirmTestDetailsPage } from './confirm-test-details.page';

@NgModule({
  declarations: [ConfirmTestDetailsPage, ConfirmSubmitModal],
  imports: [
    CommonModule,
    ComponentsModule,

    ConfirmTestDetailsPageRoutingModule,
    EffectsModule.forFeature([ConfirmTestDetailsAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonCardHeader,
    IonCard,
    IonContent,
    IonGrid,
    IonCardContent,
    IonToolbar,
    IonHeader,
    IonButton,
    IonCol,
    IonText,
    IonFooter,
    IonRow,
  ],
})
export class ConfirmTestDetailsPageModule {}
