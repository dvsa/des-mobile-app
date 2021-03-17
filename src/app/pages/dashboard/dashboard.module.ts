import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { DashboardComponentsModule } from './components/dashboard-components.module';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { ComponentsModule } from '../../../components/common/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    DashboardComponentsModule,
    ComponentsModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
