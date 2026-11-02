import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafetyAndBalanceComponent } from '@pages/test-report/cat-a-mod2/components/safety-and-balance/safety-and-balance';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  imports: [CommonModule, TestReportComponentsModule, SafetyAndBalanceComponent],
  exports: [SafetyAndBalanceComponent],
})
export class TestReportCatAMod2 {}
