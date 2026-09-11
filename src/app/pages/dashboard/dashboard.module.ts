import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';

import { VehicleRecallsBanner } from '@components/common/vehicle-recall-banner/vehicle-recalls-banner';
import {
  IonBadge,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { DashboardComponentsModule } from './components/dashboard-components.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardAnalyticsEffects } from './dashboard.analytics.effects';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    DashboardComponentsModule,
    ComponentsModule,
    EffectsModule.forFeature([DashboardAnalyticsEffects]),
    VehicleRecallsBanner,
    IonRow,
    IonCol,
    IonButtons,
    IonText,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonBadge,
    IonContent,
    IonMenuButton,
    IonGrid,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
