import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestReportCatAMod2PageRoutingModule } from './test-report.cat-a-mod2-routing.module';
import { TestReportCatAMod2Page } from './test-report.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatAMod2PageRoutingModule,
  ],
  declarations: [TestReportCatAMod2Page],
})
export class TestReportCatAMod2PageModule {}
