import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { UnuploadedTestsPage } from '@pages/unuploaded-tests/unuploaded-tests.page';
import { UnuploadedTestsRoutingModule } from '@pages/unuploaded-tests/unuploaded-tests-routing.module';
import { DashboardComponentsModule } from '@pages/dashboard/components/dashboard-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { UnuploadedTestsComponentModule } from '@pages/unuploaded-tests/components/unuploaded-tests.component.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    UnuploadedTestsRoutingModule,
    DashboardComponentsModule,
    TestSlotComponentsModule,
    UnuploadedTestsComponentModule,
  ],
  declarations: [UnuploadedTestsPage],
})
export class UnuploadedTestsModule {}
