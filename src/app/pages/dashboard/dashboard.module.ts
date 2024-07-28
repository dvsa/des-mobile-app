import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';

import { DashboardComponentsModule } from './components/dashboard-components.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardAnalyticsEffects } from './dashboard.analytics.effects';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    DashboardComponentsModule,
    ComponentsModule,
    EffectsModule.forFeature([DashboardAnalyticsEffects]),
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
