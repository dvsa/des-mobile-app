import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestReportCatCPageRoutingModule } from './test-report.cat-c-routing.module';
import { TestReportCatCPage } from './test-report.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatCPageRoutingModule,
  ],
  declarations: [TestReportCatCPage],
})
export class TestReportCatCPageModule {}
