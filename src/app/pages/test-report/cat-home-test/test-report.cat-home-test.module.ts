import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatHomeTestPageRoutingModule } from './test-report.cat-home-test-routing.module';

import { TestReportCatHomeTestPage } from './test-report.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatHomeTestPageRoutingModule,
  ],
  declarations: [TestReportCatHomeTestPage],
})
export class TestReportCatHomeTestPageModule {}
