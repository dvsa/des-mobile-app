import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { VehicleChecksComponent } from './vehicle-checks/vehicle-checks';

@NgModule({
  imports: [CommonModule, ComponentsModule, TestReportComponentsModule, VehicleChecksComponent],
  exports: [VehicleChecksComponent],
})
export class TestReportCatCComponentsModule {}
