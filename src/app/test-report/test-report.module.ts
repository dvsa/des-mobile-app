import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestReportPage } from './test-report.page';
import { TestReportPageRoutingModule } from './test-report-routing.module';
import { CompetencyComponent } from './components/competency/competency';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HammerModule,
    TestReportPageRoutingModule,
  ],
  declarations: [
    CompetencyComponent,
    TestReportPage,
  ],
})
export class TestReportModule { }
