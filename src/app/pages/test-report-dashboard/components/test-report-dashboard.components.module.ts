import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { LessonAndThemeComponent } from '@pages/test-report-dashboard/components/lesson-and-theme/lesson-and-theme';
import { TestReportComponent } from '@pages/test-report-dashboard/components/test-report/test-report';
import { DashboardItemComponent } from '@pages/test-report-dashboard/components/dashboard-item/dashboard-item';

@NgModule({
  declarations: [
    LessonAndThemeComponent,
    TestReportComponent,
    DashboardItemComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
  ],
  exports: [
    LessonAndThemeComponent,
    TestReportComponent,
    DashboardItemComponent,
  ],
})
export class TestReportCatADIPart3ComponentsModule { }
