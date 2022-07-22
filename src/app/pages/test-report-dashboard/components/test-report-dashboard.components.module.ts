import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { DashboardItemComponent } from '@pages/test-report-dashboard/components/dashboard-item/dashboard-item';
import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardItemComponent,
    ReviewFeedback,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    ReactiveFormsModule,
  ],
  exports: [
    DashboardItemComponent,
    ReviewFeedback,
  ],
})
export class TestReportCatADIPart3ComponentsModule { }
