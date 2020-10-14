import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestReportPage } from './test-report.page';
import { TestReportPageRoutingModule } from './test-report-routing.module';
import { ToolbarComponent } from './components/toolbar/toolbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportPageRoutingModule,
  ],
  declarations: [
    ToolbarComponent,
    TestReportPage,
  ],
})
export class TestReportModule { }
