import { NgModule } from '@angular/core';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';
import { ManoeuvresPopoverComponentAdiPart2 } from './manoeuvres-popover/manoeuvres-popover';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvreCompetencyComponentAdiPart2 } from './manoeuvre-competency/manoeuvre-competency';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
    VehicleCheckComponent,
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        TestReportComponentsModule,
        IonicModule,
    ],
  exports:[
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
    VehicleCheckComponent,
  ],
})
export class TestReportCatADIPart2ComponentsModule {}
