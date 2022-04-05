import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  SafetyAndBalanceComponent,
} from '@pages/test-report/cat-a-mod2/components/safety-and-balance/safety-and-balance';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    SafetyAndBalanceComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    IonicModule,
    DirectivesModule,
  ],
  exports: [
    SafetyAndBalanceComponent,
  ],
})
export class TestReportCatAMod2ComponentsModule { }
