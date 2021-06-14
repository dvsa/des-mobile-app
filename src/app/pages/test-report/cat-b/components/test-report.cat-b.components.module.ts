import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';
import { ManoeuvresPopoverComponent } from './manoeuvres-popover/manoeuvres-popover';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponent,
    VehicleCheckComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
  ],
  exports: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponent,
    VehicleCheckComponent,
  ],
})
export class TestReportCatBComponentsModule {}
