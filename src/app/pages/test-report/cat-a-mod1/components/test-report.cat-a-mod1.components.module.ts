import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCol, IonRow } from '@ionic/angular';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ActivityCode4ModalModule } from './activity-code-4-modal/activity-code-4-modal.module';
import { SpeedCheckHeaderComponent } from './speed-check-header/speed-check-header';
import { SpeedCheckModalModule } from './speed-check-modal/speed-check-modal.module';
import { SpeedCheckComponent } from './speed-check/speed-check';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    ActivityCode4ModalModule,
    SpeedCheckModalModule,
    IonCol,
    IonRow,
    SpeedCheckHeaderComponent,
    SpeedCheckComponent,
  ],
  exports: [SpeedCheckHeaderComponent, SpeedCheckComponent],
})
export class TestReportCatAMod1ComponentsModule {}
