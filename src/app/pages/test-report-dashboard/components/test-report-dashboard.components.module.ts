import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { DashboardItemComponent } from '@pages/test-report-dashboard/components/dashboard-item/dashboard-item';

@NgModule({
  declarations: [
    DashboardItemComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
  ],
  exports: [
    DashboardItemComponent,
  ],
})
export class TestReportCatADIPart3ComponentsModule { }
