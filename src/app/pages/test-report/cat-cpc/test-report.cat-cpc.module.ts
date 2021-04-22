import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatCPCPageRoutingModule } from './test-report.cat-cpc-routing.module';

import { TestReportCatCPCPage } from './test-report.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatCPCPageRoutingModule,
  ],
  declarations: [TestReportCatCPCPage],
})
export class TestReportCatCPCPageModule {}
