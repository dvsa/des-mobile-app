import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatADIPart2PageRoutingModule } from './test-report.cat-adi-part2-routing.module';

import { TestReportCatAdiPart2Page } from './test-report.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatADIPart2PageRoutingModule,
  ],
  declarations: [TestReportCatAdiPart2Page],
})
export class TestReportCatADIPart2PageModule {}
