import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatBEPageRoutingModule } from './test-report.cat-be-routing.module';

import { TestReportCatBEPage } from './test-report.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatBEPageRoutingModule,
  ],
  declarations: [TestReportCatBEPage],
})
export class TestReportCatBEPageModule {}
