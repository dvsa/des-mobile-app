import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ManoeuvresPopoverComponent } from './manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './vehicle-check/vehicle-check';
import {IonCol, IonGrid, IonIcon, IonRow} from "@ionic/angular";

@NgModule({
  declarations: [ManoeuvresComponent, ManoeuvresPopoverComponent, VehicleCheckComponent],
  imports: [CommonModule, ComponentsModule, TestReportComponentsModule, IonCol, IonRow, IonIcon, IonGrid],
  exports: [ManoeuvresComponent, ManoeuvresPopoverComponent, VehicleCheckComponent],
})
export class TestReportCatBComponentsModule {}
