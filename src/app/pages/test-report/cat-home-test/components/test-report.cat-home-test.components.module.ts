import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { VehicleChecksComponent } from './vehicle-checks/vehicle-checks';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    VehicleChecksComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    IonicModule,
    DirectivesModule,
    ComponentsModule,
  ],
  exports: [
    VehicleChecksComponent,
  ],
})
export class TestReportCatHomeTestComponentsModule { }
