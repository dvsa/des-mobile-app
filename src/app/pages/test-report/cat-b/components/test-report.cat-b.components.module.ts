import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvresPopoverComponent } from './manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';

@NgModule({
  declarations: [ManoeuvresComponent, ManoeuvresPopoverComponent, VehicleCheckComponent],
  imports: [IonicModule, CommonModule, ComponentsModule, TestReportComponentsModule],
  exports: [ManoeuvresComponent, ManoeuvresPopoverComponent, VehicleCheckComponent],
})
export class TestReportCatBComponentsModule {}
