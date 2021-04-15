import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatBPageRoutingModule } from './test-report.cat-b-routing.module';

import { TestReportCatBPage } from './test-report.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatBPageRoutingModule,
  ],
  declarations: [TestReportCatBPage],
})
export class TestReportCatBPageModule {}
