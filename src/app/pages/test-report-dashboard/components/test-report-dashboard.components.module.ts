import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';

import { IonCard, IonCardContent, IonCol, IonIcon, IonRow } from '@ionic/angular';
import { DashboardItemComponent } from '@pages/test-report-dashboard/components/dashboard-item/dashboard-item';
import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';

@NgModule({
  declarations: [DashboardItemComponent, ReviewFeedback],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    ReactiveFormsModule,
    IonCol,
    IonRow,
    IonIcon,
    IonCardContent,
    IonCard,
  ],
  exports: [DashboardItemComponent, ReviewFeedback],
})
export class TestReportCatADIPart3ComponentsModule {}
