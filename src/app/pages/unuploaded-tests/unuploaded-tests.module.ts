import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { DashboardComponentsModule } from '@pages/dashboard/components/dashboard-components.module';
import { UnuploadedTestsRoutingModule } from '@pages/unuploaded-tests/unuploaded-tests-routing.module';
import { UnuploadedTestsAnalyticsEffects } from '@pages/unuploaded-tests/unuploaded-tests.analytics.effects';
import { UnuploadedTestsEffects } from '@pages/unuploaded-tests/unuploaded-tests.effects';
import { UnuploadedTestsPage } from '@pages/unuploaded-tests/unuploaded-tests.page';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    UnuploadedTestsRoutingModule,
    DashboardComponentsModule,
    TestSlotComponentsModule,
    EffectsModule.forFeature([UnuploadedTestsEffects, UnuploadedTestsAnalyticsEffects]),
  ],
  declarations: [UnuploadedTestsPage],
  providers: [OrientationMonitorProvider],
})
export class UnuploadedTestsModule {}
