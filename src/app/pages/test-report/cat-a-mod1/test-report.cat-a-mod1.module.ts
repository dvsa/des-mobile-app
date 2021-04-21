import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportCatAMod1PageRoutingModule } from './test-report.cat-a-mod1-routing.module';

import { TestReportCatAMod1Page } from './test-report.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatAMod1PageRoutingModule,
  ],
  declarations: [TestReportCatAMod1Page],
})
export class TestReportCatAMod1PageModule {}
