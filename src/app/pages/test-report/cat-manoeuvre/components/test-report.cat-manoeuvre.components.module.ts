import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { ReverseManoeuvreComponent } from '@pages/test-report/cat-manoeuvre/components/reverse-manoeuvre/reverse-manoeuvre';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ReverseManoeuvreComponent],
  imports: [IonicComponentsModule, CommonModule, ComponentsModule, TestReportComponentsModule],
  exports: [ReverseManoeuvreComponent],
})
export class TestReportCatManoeuvreComponentsModule {}
