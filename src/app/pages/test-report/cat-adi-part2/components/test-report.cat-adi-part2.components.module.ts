import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvreCompetencyComponentAdiPart2 } from './manoeuvre-competency/manoeuvre-competency';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { ManoeuvresPopoverComponentAdiPart2 } from './manoeuvres-popover/manoeuvres-popover';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';

@NgModule({
  declarations: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
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
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
    VehicleCheckComponent,
  ],
})
export class TestReportCatADIPart2ComponentsModule {}
