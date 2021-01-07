import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { DashboardComponentsModule } from './components/dashboard-components.module';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    DashboardComponentsModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
