import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvreCompetencyComponentAdiPart2 } from './manoeuvre-competency/manoeuvre-competency';
import { ManoeuvresPopoverComponentAdiPart2 } from './manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';

@NgModule({
  declarations: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
    VehicleCheckComponent,
  ],
  imports: [CommonModule, ComponentsModule, TestReportComponentsModule, IonCol, IonRow, IonIcon, IonGrid],
  exports: [
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    ManoeuvreCompetencyComponentAdiPart2,
    VehicleCheckComponent,
  ],
})
export class TestReportCatADIPart2ComponentsModule {}
