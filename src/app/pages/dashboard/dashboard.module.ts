import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';

import { DashboardPage } from './dashboard.page';
import { DashboardComponentsModule } from './components/dashboard-components.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardAnalyticsEffects } from './dashboard.analytics.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    DashboardComponentsModule,
    ComponentsModule,
    EffectsModule.forFeature([
      DashboardAnalyticsEffects,
    ]),
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
