import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestReportCatADIPart3PageRoutingModule } from './test-report.cat-adi-part3.routing.module';
import { TestReportCatADI3Page } from './test-report.cat-adi-part3.page';

@NgModule({
  declarations: [TestReportCatADI3Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatADIPart3PageRoutingModule,
  ],
})
export class TestReportCatADIPart3PageModule {}
