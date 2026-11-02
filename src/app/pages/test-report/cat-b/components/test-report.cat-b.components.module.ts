import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvresPopoverComponent } from './manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';

@NgModule({
  imports: [
    CommonModule,
    TestReportComponentsModule,
    IonCol,
    IonRow,
    IonIcon,
    IonGrid,
    ManoeuvresComponent,
    ManoeuvresPopoverComponent,
    VehicleCheckComponent,
  ],
  exports: [ManoeuvresComponent, ManoeuvresPopoverComponent, VehicleCheckComponent],
})
export class TestReportCatBComponentsModule {}
