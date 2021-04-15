import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatBePageRoutingModule } from './test-report.cat-be-routing.module';

import { TestReportCatBePage } from './test-report.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatBePageRoutingModule,
  ],
  declarations: [TestReportCatBePage],
})
export class TestReportCatBePageModule {}
