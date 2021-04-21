import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestReportCatDPageRoutingModule } from './test-report.cat-d-routing.module';
import { TestReportCatDPage } from './test-report.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatDPageRoutingModule,
  ],
  declarations: [TestReportCatDPage],
})
export class TestReportCatDPageModule {}
