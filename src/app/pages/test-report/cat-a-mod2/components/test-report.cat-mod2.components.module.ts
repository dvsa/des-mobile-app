import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';

import { SafetyAndBalanceComponent } from '@pages/test-report/cat-a-mod2/components/safety-and-balance/safety-and-balance';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [SafetyAndBalanceComponent],
  imports: [CommonModule, ComponentsModule, TestReportComponentsModule, DirectivesModule],
  exports: [SafetyAndBalanceComponent],
})
export class TestReportCatAMod2ComponentsModule {}
